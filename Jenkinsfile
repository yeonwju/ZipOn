pipeline {
  agent any

  environment {
    DOCKER_OPTS = "--pull"
    HEALTH = "/usr/local/bin/zipon-health.sh"
    PROD_COMPOSE = "/home/ubuntu/zipon-app/docker-compose.service.yml"
    DEV_COMPOSE  = "/home/ubuntu/zipon-app/docker-compose.dev.yml"

    SPRING_DATASOURCE_URL      = credentials('SPRING_DATASOURCE_URL')
    SPRING_DATASOURCE_USERNAME = credentials('SPRING_DATASOURCE_USERNAME')
    SPRING_DATASOURCE_PASSWORD = credentials('SPRING_DATASOURCE_PASSWORD')

    GOOGLE_CLIENT_ID           = credentials('GOOGLE_CLIENT_ID')
    GOOGLE_CLIENT_SECRET       = credentials('GOOGLE_CLIENT_SECRET')

    SSAFY_API_KEY              = credentials('SSAFY_API_KEY')
    SSAFY_API_URL              = credentials('SSAFY_API_URL')
    GOV_API_KEY                = credentials('GOV_API_KEY')
    BIZNO_API_KEY              = credentials('BIZNO_API_KEY')
    BIZNO_API_URL              = credentials('BIZNO_API_URL')

    REDIS_PASSWORD             = credentials('REDIS_PASSWORD')

    SOLAPI_API_KEY             = credentials('SOLAPI_API_KEY')
    SOLAPI_API_SECRET_KEY      = credentials('SOLAPI_API_SECRET_KEY')
    SOLAPI_API_TEL             = credentials('SOLAPI_API_TEL')

    OPENVIDU_URL               = credentials('OPENVIDU_URL')
    OPENVIDU_SECRET            = credentials('OPENVIDU_SECRET')

    NEXT_PUBLIC_KAKAO_MAP_API_KEY = credentials('NEXT_PUBLIC_KAKAO_MAP_API_KEY')
    NEXT_PUBLIC_PWA_ENABLE     = '1'

    AWS_REGION   = "ap-northeast-2"
    S3_SWAGGER   = "s3://zipon-media/dev/swagger/swagger.json"

    // ES 네이밍 통일: compose는 ELASTICSEARCH_URL 사용
    ES_URL = 'http://zipondev-elasticsearch:9200'
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

          echo "Using FRONT_API_BASE_URL = ${FRONT_API_BASE_URL}"
          echo "Building images for commit ${gitsha} (branch=${env.BRANCH_NAME})"

          parallel failFast: false,
          FRONTEND: {
            sh """
              docker build ${env.DOCKER_OPTS} \
                --build-arg NEXT_PUBLIC_API_BASE_URL='${FRONT_API_BASE_URL}' \
                --build-arg NEXT_PUBLIC_KAKAO_MAP_API_KEY="${NEXT_PUBLIC_KAKAO_MAP_API_KEY}" \
                --build-arg NEXT_PUBLIC_PWA_ENABLE="${NEXT_PUBLIC_PWA_ENABLE}" \
                -t zipon-frontend:latest -t zipon-frontend:${gitsha} ./frontend
            """
          },
          BACKEND: {
            sh "docker build ${env.DOCKER_OPTS} -t zipon-backend:latest -t zipon-backend:${gitsha} ./backend"
          },
          AI: {
            sh "docker build ${env.DOCKER_OPTS} -t zipon-ai:latest -t zipon-ai:${gitsha} ./ai || true"
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
          def devComposeExists = sh(script: "test -f ${env.DEV_COMPOSE}", returnStatus: true) == 0
          if (devComposeExists) {
            sh """
              set -e
              echo "[DEV] Deploying with ${env.DEV_COMPOSE}"
              docker compose -f ${env.DEV_COMPOSE} up -d --force-recreate --remove-orphans

              echo "[DEV] Warm-up & health check (retry up to 60s)..."
              for i in \$(seq 1 60); do
                if curl -sf http://127.0.0.1:28080/actuator/health || \
                   curl -sf http://127.0.0.1:28080/api/actuator/health; then
                  echo "OK on attempt \$i"; break
                fi
                sleep 1
                if [ "\$i" -eq 60 ]; then
                  echo "[DEV] health check failed after 60s"
                  docker logs --tail=200 zipondev-backend || true
                  exit 1
                fi
              done
            """
          } else {
            echo "[DEV] ${env.DEV_COMPOSE} not found. Skipping deploy."
          }
        }
      }
    }

    stage('Publish OpenAPI (DEV)') {
      when { anyOf { branch 'dev'; branch 'develop' } }
      steps {
        sh '''
          set -e
          mkdir -p build
          for i in 1 2 3 4 5 6 7 8 9 10; do
            curl -fsS http://127.0.0.1:28080/v3/api-docs > build/swagger.json && break
            echo "[DEV] swagger not ready, retrying ($i/10)..."
            sleep 2
          done
          test -s build/swagger.json
          echo "[DEV] OpenAPI saved to build/swagger.json (length: $(wc -c < build/swagger.json))"
          # aws s3 cp build/swagger.json $S3_SWAGGER --region $AWS_REGION --cache-control max-age=60 || true
        '''
      }
    }

    stage('Deploy PROD') {
      when { anyOf { branch 'main'; branch 'master' } }
      steps {
        sh """
          set -e
          echo "[PROD] Deploying with ${env.PROD_COMPOSE}"
          docker compose -f ${env.PROD_COMPOSE} up -d --force-recreate --remove-orphans

          echo "[PROD] Warm-up & health check..."
          if [ -x ${env.HEALTH} ]; then
            ${env.HEALTH} || echo "[WARN] Health check failed"
          fi

          curl -s -o /dev/null -w "FRONT / -> %{http_code}\\n" https://zipon.duckdns.org/
          curl -s -o /dev/null -w "BACK /api/ -> %{http_code}\\n" https://zipon.duckdns.org/api/
          curl -s -o /dev/null -w "AI /ai/ -> %{http_code}\\n" https://zipon.duckdns.org/ai/
        """
      }
    }
  }

  post {
    always {
      echo "✅ Build finished. Cleaning workspace..."
      sh 'docker system prune -af || true'
    }
    failure {
      echo "❌ Pipeline failed. Check logs."
    }
  }

}
