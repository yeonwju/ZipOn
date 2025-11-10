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
    AWS_ACCESS_KEY_ID = credentials('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
    S3_SWAGGER = "s3://zipon-media/dev/swagger/swagger.json"

    // --- Elasticsearch ---
    ES_URL            = 'http://zipondev-elasticsearch:9200'
    ELASTICSEARCH_URL = 'http://zipondev-elasticsearch:9200'

    FRONT_URL = ''
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
          env.FRONT_URL = (env.BRANCH_NAME == 'dev')
            ? "https://dev-zipon.duckdns.org"
            : "https://zipon.duckdns.org"

          echo "🌐 FRONT_URL set to: ${env.FRONT_URL}"
        }
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
              docker build --no-cache ${env.DOCKER_OPTS} \
                --build-arg NEXT_PUBLIC_API_BASE_URL='${FRONT_API_BASE_URL}' \
                --build-arg NEXT_PUBLIC_KAKAO_MAP_API_KEY=\$NEXT_PUBLIC_KAKAO_MAP_API_KEY \
                --build-arg NEXT_PUBLIC_PWA_ENABLE=\$NEXT_PUBLIC_PWA_ENABLE \
                -t zipon-frontend:latest -t zipon-frontend:${gitsha} ./frontend
            """
          },
          BACKEND: {
            sh """
              set -e
              # FRONT_URL은 Jenkins 환경변수에서 전달되어 Spring @Value로 사용됨
              docker build ${env.DOCKER_OPTS} \
                --build-arg FRONT_URL='${env.FRONT_URL}' \
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

            echo "[DEV] Health check zipondev-backend:8080/v3/api-docs ..."
            OK=""
            for i in $(seq 1 60); do
              if curl -sfm 2 http://zipondev-backend:8080/v3/api-docs >/dev/null; then
                echo "[DEV] ✅ OK on attempt $i"
                OK=1
                break
              fi
              echo "[DEV] Waiting for backend... ($i/60)"
              sleep 2
            done
            [ -n "$OK" ] || { echo "[DEV] ❌ Health check failed"; exit 1; }
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
          echo "[DEV] Fetching OpenAPI..."
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
