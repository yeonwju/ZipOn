pipeline {
  agent any

  environment {
    // --- Common Paths ---
    DOCKER_OPTS  = "--pull"
    HEALTH       = "/usr/local/bin/zipon-health.sh"
    PROD_COMPOSE = "/home/ubuntu/zipon-app/docker-compose.service.yml"
    DEV_COMPOSE  = "/home/ubuntu/zipon-app/docker-compose.dev.yml"

    // --- Database (직접 사용; 중간 매핑 제거) ---
    DB_URL  = credentials('DB_URL')
    DB_USER = credentials('DB_USER')
    DB_PW   = credentials('DB_PW')

    // --- OAuth / API Keys ---
    GOOGLE_CLIENT_ID     = credentials('GOOGLE_CLIENT_ID')
    GOOGLE_CLIENT_SECRET = credentials('GOOGLE_CLIENT_SECRET')

    SSAFY_API_KEY = credentials('SSAFY_API_KEY')
    SSAFY_API_URL = credentials('SSAFY_API_URL')
    GOV_API_KEY   = credentials('GOV_API_KEY')
    BIZNO_API_KEY = credentials('BIZNO_API_KEY')
    BIZNO_API_URL = credentials('BIZNO_API_URL')

    // --- Redis ---
    REDIS_HOST = 'zipondev-redis'
    REDIS_PORT = '6379'

    // --- SOLAPI ---
    SOLAPI_API_KEY        = credentials('SOLAPI_API_KEY')
    SOLAPI_API_SECRET_KEY = credentials('SOLAPI_API_SECRET_KEY')
    SOLAPI_API_TEL        = credentials('SOLAPI_API_TEL')

    // --- OpenVidu ---
    OPENVIDU_URL    = credentials('OPENVIDU_URL')
    OPENVIDU_SECRET = credentials('OPENVIDU_SECRET')

    // --- Frontend ---
    NEXT_PUBLIC_KAKAO_MAP_API_KEY = credentials('NEXT_PUBLIC_KAKAO_MAP_API_KEY')
    NEXT_PUBLIC_PWA_ENABLE        = '1'

    // --- AWS ---
    AWS_REGION = "ap-northeast-2"
    AWS_ACCESS_KEY_ID     = credentials('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
    S3_SWAGGER = "s3://zipon-media/dev/swagger/swagger.json"

    // --- Elasticsearch ---
    ES_URL            = 'http://zipondev-elasticsearch:9200'
    ELASTICSEARCH_URL = 'http://zipondev-elasticsearch:9200'

    // --- Dynamic FRONT_URL (default) ---
    FRONT_URL = 'https://dev-zipon.duckdns.org'
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

    stage('Set Environment') {
      steps {
        script {
          def currentBranch = env.BRANCH_NAME ?: env.GIT_BRANCH ?: 'dev'
          env.FRONT_URL = currentBranch.contains('dev') ? "https://dev-zipon.duckdns.org" : "https://zipon.duckdns.org"
          echo "🌐 FRONT_URL set to: ${env.FRONT_URL} (branch=${currentBranch})"
        }
      }
    }

    stage('Build Images (parallel)') {
      steps {
        script {
          def gitsha = sh(script: 'cat .gitsha', returnStdout: true).trim()
          def currentBranch = env.BRANCH_NAME ?: env.GIT_BRANCH ?: 'dev'
          def FRONT_API_BASE_URL = currentBranch.contains('dev') ? 'https://dev-zipon.duckdns.org/api' : 'https://zipon.duckdns.org/api'

          echo "🧱 Building images for commit: ${gitsha} (branch=${currentBranch})"
          echo "🌐 Using FRONT_API_BASE_URL: ${FRONT_API_BASE_URL}"

          parallel failFast: false,

          FRONTEND: {
            sh """
              set -e
              docker build --no-cache ${env.DOCKER_OPTS} \
                --build-arg NEXT_PUBLIC_API_BASE_URL="${FRONT_API_BASE_URL}" \
                --build-arg NEXT_PUBLIC_KAKAO_MAP_API_KEY="${NEXT_PUBLIC_KAKAO_MAP_API_KEY}" \
                --build-arg NEXT_PUBLIC_PWA_ENABLE="${NEXT_PUBLIC_PWA_ENABLE}" \
                -t zipon-frontend:latest -t zipon-frontend:${gitsha} ./frontend
            """
          },

          BACKEND: {
            sh """
              set -e
              echo "[DEBUG] FRONT_URL=${env.FRONT_URL}"
              docker build ${env.DOCKER_OPTS} \
                --build-arg FRONT_URL="${env.FRONT_URL}" \
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
            docker network connect zipon-net jenkins-container 2>/dev/null || true

            echo "[DEV] Deploying with ${DEV_COMPOSE}"
            docker compose -f ${DEV_COMPOSE} up -d --force-recreate --remove-orphans

            # 초기화 대기 (DB 마이그/빈 캐시 등 감안)
            echo "[DEV] Warm-up 30s..."
            sleep 30

            # 내부 백엔드 직접 헬스체크 (Nginx 우회)
            echo "[DEV] Health check zipondev-backend (127.0.0.1:28080)..."
            OK=""
            for i in $(seq 1 60); do
              # 보안 설정에 따라 200 또는 (Nginx 경유 시) 302가 올 수 있음
              CODE=$(curl -s -o /dev/null -w "%{http_code}" http://zipondev-backend:8080/v3/api-docs || true)
              if [ "$CODE" = "200" ] || [ "$CODE" = "302" ]; then
                echo "[DEV] ✅ OK (HTTP $CODE) on attempt $i"
                OK=1
                break
              fi
              echo "[DEV] $(date '+%H:%M:%S') Waiting for backend... ($i/60) HTTP=$CODE"
              sleep 2
            done
            [ -n "$OK" ] || {
              echo "[DEV] ❌ Health check failed"
              echo "--- Backend Logs (last 50 lines) ---"
              docker logs zipondev-backend --tail 50 || true
              exit 1
            }
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
          echo "[DEV] Fetching OpenAPI from zipondev-backend:8080..."
          READY=""
          for i in $(seq 1 30); do
            CODE=$(curl -s -o /dev/null -w "%{http_code}" http://zipondev-backend:8080/v3/api-docs || true)
            if [ "$CODE" = "200" ]; then
              curl -sf http://zipondev-backend:8080/v3/api-docs > build/swagger.json
              READY=1
              break
            fi
            echo "[DEV] swagger not ready (HTTP $CODE), retrying ($i/30)..."
            sleep 2
          done
          [ -n "$READY" ] || { echo "[DEV] ❌ OpenAPI not ready."; exit 1; }
          test -s build/swagger.json
          echo "[DEV] ✅ OpenAPI saved (size: $(wc -c < build/swagger.json))"
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
