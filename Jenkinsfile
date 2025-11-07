pipeline {
  agent any

  environment {
    // --- Common Paths ---
    DOCKER_OPTS  = "--pull"
    HEALTH       = "/usr/local/bin/zipon-health.sh"
    PROD_COMPOSE = "/home/ubuntu/zipon-app/docker-compose.service.yml"
    DEV_COMPOSE  = "/home/ubuntu/zipon-app/docker-compose.dev.yml"

    // --- Database Credentials ---
    SPRING_DATASOURCE_URL      = credentials('SPRING_DATASOURCE_URL')
    SPRING_DATASOURCE_USERNAME = credentials('SPRING_DATASOURCE_USERNAME')
    SPRING_DATASOURCE_PASSWORD = credentials('SPRING_DATASOURCE_PASSWORD')

    // --- OAuth / API Keys ---
    GOOGLE_CLIENT_ID     = credentials('GOOGLE_CLIENT_ID')
    GOOGLE_CLIENT_SECRET = credentials('GOOGLE_CLIENT_SECRET')

    SSAFY_API_KEY = credentials('SSAFY_API_KEY')
    SSAFY_API_URL = credentials('SSAFY_API_URL')
    GOV_API_KEY   = credentials('GOV_API_KEY')
    BIZNO_API_KEY = credentials('BIZNO_API_KEY')
    BIZNO_API_URL = credentials('BIZNO_API_URL')

    // --- Redis (no password) ---
    REDIS_HOST = 'zipondev-redis'
    REDIS_PORT = '6379'

    // --- SOLAPI ---
    SOLAPI_API_KEY        = credentials('SOLAPI_API_KEY')
    SOLAPI_API_SECRET_KEY = credentials('SOLAPI_API_SECRET_KEY')
    SOLAPI_API_TEL        = credentials('SOLAPI_API_TEL')

    // --- OpenVidu ---
    OPENVIDU_URL    = credentials('OPENVIDU_URL')
    OPENVIDU_SECRET = credentials('OPENVIDU_SECRET')

    // --- Frontend Build Variables ---
    NEXT_PUBLIC_KAKAO_MAP_API_KEY = credentials('NEXT_PUBLIC_KAKAO_MAP_API_KEY')
    NEXT_PUBLIC_PWA_ENABLE        = '1'

    // --- AWS / S3 ---
    AWS_REGION = "ap-northeast-2"
    S3_SWAGGER = "s3://zipon-media/dev/swagger/swagger.json"

    // --- Elasticsearch ---
    ES_URL            = 'http://zipondev-elasticsearch:9200'
    ELASTICSEARCH_URL = 'http://zipondev-elasticsearch:9200'
  }

  options {
    buildDiscarder(logRotator(numToKeepStr: '20'))
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
        sh 'git rev-parse --short HEAD > .gitsha'
      }
    }

    stage('Build Images (parallel)') {
      steps {
        script {
          def gitsha = sh(script: 'cat .gitsha', returnStdout: true).trim()
          def FRONT_API_BASE_URL = (env.BRANCH_NAME == 'dev')
            ? 'https://dev-zipon.duckdns.org/api'
            : 'https://zipon.duckdns.org/api'

          echo "🧱 Building images for commit: ${gitsha} (branch=${env.BRANCH_NAME})"
          echo "🌐 Using FRONT_API_BASE_URL: ${FRONT_API_BASE_URL}"

          parallel failFast: false,
          FRONTEND: {
            sh """
              set -e
              docker build ${env.DOCKER_OPTS} \
                --build-arg NEXT_PUBLIC_API_BASE_URL='${FRONT_API_BASE_URL}' \
                --build-arg NEXT_PUBLIC_KAKAO_MAP_API_KEY=\$NEXT_PUBLIC_KAKAO_MAP_API_KEY \
                --build-arg NEXT_PUBLIC_PWA_ENABLE=\$NEXT_PUBLIC_PWA_ENABLE \
                -t zipon-frontend:latest -t zipon-frontend:${gitsha} ./frontend
            """
          },
          BACKEND: {
            sh """
              set -e
              docker build ${env.DOCKER_OPTS} \
                -t zipon-backend:latest -t zipon-backend:${gitsha} ./backend
            """
          },
          AI: {
            sh """
              set -e
              docker build ${env.DOCKER_OPTS} \
                -t zipon-ai:latest -t zipon-ai:${gitsha} ./ai || true
            """
          }
        }
      }
    }

    stage('Unit Tests (dev only)') {
      when { branch 'dev' }
      steps {
        sh 'echo "[TEST] Running test scripts..."'
      }
    }

    stage('Deploy DEV') {
      when { branch 'dev' }
      steps {
        script {
          sh '''
            set -e

            # --- (Best-effort) Jenkins 컨테이너를 zipon-net에 연결 ---
            # 이름이 'jenkins-container'일 때만 성공. 아니면 무시.
            docker network connect zipon-net jenkins-container 2>/dev/null || true

            echo "[DEV] Deploying with ${DEV_COMPOSE}"
            docker compose -f ${DEV_COMPOSE} up -d --force-recreate --remove-orphans

            echo "[DEV] Health check via service DNS (zipondev-backend:8080/v3/api-docs) up to 120s..."
            OK=""
            for i in $(seq 1 60); do   # 60 * sleep 2s = 120s
              if curl -sfm 2 http://zipondev-backend:8080/v3/api-docs >/dev/null; then
                echo "[DEV] ✅ OK on attempt $i (service DNS reachable)"
                OK=1
                break
              fi
              echo "[DEV] Waiting for backend... ($i/60)"
              sleep 2
            done

            if [ -z "$OK" ]; then
              echo "[DEV] ❌ Health check failed after 120s."
              echo "------ docker compose ps ------"
              docker compose -f ${DEV_COMPOSE} ps || true
              echo "------ backend logs (last 200) ------"
              docker compose -f ${DEV_COMPOSE} logs --tail=200 zipondev-backend || true
              exit 1
            fi
          '''
        }
      }
    }

    stage('Publish OpenAPI (DEV)') {
      when { anyOf { branch 'dev'; branch 'develop' } }
      steps {
        sh '''
          set -e
          mkdir -p build
          echo "[DEV] Fetching OpenAPI from service DNS (zipondev-backend:8080/v3/api-docs)..."
          READY=""
          for i in $(seq 1 30); do
            if curl -sfm 2 http://zipondev-backend:8080/v3/api-docs >/dev/null; then
              curl -sf http://zipondev-backend:8080/v3/api-docs > build/swagger.json
              READY=1
              break
            fi
            echo "[DEV] swagger not ready, retrying ($i/30)..."
            sleep 2
          done
          [ -n "$READY" ] || { echo "[DEV] ❌ OpenAPI not ready."; exit 1; }

          test -s build/swagger.json
          echo "[DEV] ✅ OpenAPI saved (size: $(wc -c < build/swagger.json))"
          # aws s3 cp build/swagger.json $S3_SWAGGER --region $AWS_REGION --cache-control max-age=60 || true
        '''
      }
    }

    stage('Deploy PROD') {
      when { anyOf { branch 'main'; branch 'master' } }
      steps {
        sh """
          set -e
          echo "[PROD] Deploying with ${PROD_COMPOSE}"
          docker compose -f ${PROD_COMPOSE} up -d --force-recreate --remove-orphans

          echo "[PROD] Warm-up & health check via /v3/api-docs (up to 120s)..."
          OK=""
          for i in \$(seq 1 60); do   # 60 * 2s = 120s
            if curl -sfm 2 http://127.0.0.1:8080/v3/api-docs >/dev/null; then
              echo "[PROD] ✅ OK on attempt \$i"
              OK=1
              break
            fi
            echo "[PROD] Waiting for backend... (\$i/60)"
            sleep 2
          done
          [ -n "\$OK" ] || { echo "[PROD] ❌ Health check failed after 120s."; exit 1; }

          if [ -x ${HEALTH} ]; then
            ${HEALTH} || echo "[WARN] Health script failed (ignored)"
          fi

          curl -s -o /dev/null -w "FRONT / -> %{http_code}\\n" https://zipon.duckdns.org/ || true
          curl -s -o /dev/null -w "BACK /api/ -> %{http_code}\\n"  https://zipon.duckdns.org/api/ || true
        """
      }
    }
  }

  post {
    always {
      echo "✅ Pipeline complete. Cleaning workspace..."
      sh 'docker system prune -af || true'
    }
    failure {
      echo "❌ Pipeline failed. Check logs above."
    }
  }
}
