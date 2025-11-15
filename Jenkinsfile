pipeline {
  agent any

  environment {
    // DOCKER_BUILDKIT = '1'
    // COMPOSE_DOCKER_CLI_BUILD = '1'

    // --- Common Paths ---
    DOCKER_OPTS  = "--pull"
    HEALTH       = "/usr/local/bin/zipon-health.sh"
    PROD_COMPOSE = "/home/ubuntu/zipon-app/docker-compose.service.yml"
    DEV_COMPOSE  = "/home/ubuntu/zipon-app/docker-compose.dev.yml"

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
    NEXT_PUBLIC_SOCKET_URL        = "https://dev-zipon.duckdns.org/ws"

    // --- AWS ---
    AWS_REGION = "ap-northeast-2"
    AWS_ACCESS_KEY_ID     = credentials('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')

    // --- Elasticsearch ---
    ELASTICSEARCH_URL = 'zipondev-elasticsearch'

    // --- Default FRONT_URL ---
    FRONT_URL = 'https://dev-zipon.duckdns.org'
  }

  options {
    buildDiscarder(logRotator(numToKeepStr: '20'))
    skipStagesAfterUnstable()
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
          echo "🌐 FRONT_URL = ${env.FRONT_URL}"
        }
      }
    }

    stage('Build Images (Stable)') {
      steps {
        script {
          def gitsha = sh(script: 'cat .gitsha', returnStdout: true).trim()
          def currentBranch = env.BRANCH_NAME ?: env.GIT_BRANCH ?: 'dev'
          def FRONT_API_BASE_URL = currentBranch.contains('dev') ? 'https://dev-zipon.duckdns.org' : 'https://zipon.duckdns.org'

          echo "🧱 Building images for commit ${gitsha} (branch=${currentBranch})"

          sh """
            set -e
            echo "[1/3] ⚡ FRONTEND build"
            docker build ${env.DOCKER_OPTS} \
              --build-arg NEXT_PUBLIC_API_BASE_URL="${FRONT_API_BASE_URL}" \
              --build-arg NEXT_PUBLIC_KAKAO_MAP_API_KEY="${NEXT_PUBLIC_KAKAO_MAP_API_KEY}" \
              --build-arg NEXT_PUBLIC_PWA_ENABLE="${NEXT_PUBLIC_PWA_ENABLE}" \
              --build-arg NEXT_PUBLIC_SOCKET_URL="${NEXT_PUBLIC_SOCKET_URL}" \
              -t zipon-frontend:latest -t zipon-frontend:${gitsha} ./frontend

            echo "[2/3] ⚙️ BACKEND build"
            docker build ${env.DOCKER_OPTS} \
              --build-arg FRONT_URL="${env.FRONT_URL}" \
              -t zipon-backend:latest -t zipon-backend:${gitsha} ./backend

            echo "[3/3] 🤖 AI build"
            docker build ${env.DOCKER_OPTS} \
              -t zipon-ai:latest -t zipon-ai:${gitsha} ./ai
          """
        }
      }
    }

    stage('Deploy DEV') {
      when { branch 'dev' }
      steps {
        script {
          withCredentials([
            string(credentialsId: 'DB_URL',  variable: 'SPRING_DATASOURCE_URL'),
            string(credentialsId: 'DB_USER', variable: 'SPRING_DATASOURCE_USERNAME'),
            string(credentialsId: 'DB_PW',   variable: 'SPRING_DATASOURCE_PASSWORD'),
            string(credentialsId: 'GMS_KEY', variable: 'GMS_KEY'),
            string(credentialsId: 'GMS_API_URL', variable: 'GMS_API_URL'),
            string(credentialsId: 'MODEL_NAME', variable: 'MODEL_NAME')
          ]) {
            sh '''
              set -e
              docker network connect zipon-net jenkins-container 2>/dev/null || true

              echo "[DEV] Creating .env file at /home/ubuntu/zipon-app/.env..."
              cat <<EOF2 > /home/ubuntu/zipon-app/.env
SPRING_DATASOURCE_URL=$SPRING_DATASOURCE_URL
SPRING_DATASOURCE_USERNAME=$SPRING_DATASOURCE_USERNAME
SPRING_DATASOURCE_PASSWORD=$SPRING_DATASOURCE_PASSWORD
GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
SSAFY_API_KEY=$SSAFY_API_KEY
SSAFY_API_URL=$SSAFY_API_URL
GOV_API_KEY=$GOV_API_KEY
BIZNO_API_KEY=$BIZNO_API_KEY
BIZNO_API_URL=$BIZNO_API_URL
SOLAPI_API_KEY=$SOLAPI_API_KEY
SOLAPI_API_SECRET_KEY=$SOLAPI_API_SECRET_KEY
SOLAPI_API_TEL=$SOLAPI_API_TEL
REDIS_HOST=$REDIS_HOST
REDIS_PORT=$REDIS_PORT
ELASTICSEARCH_URL=$ELASTICSEARCH_URL
OPENVIDU_URL=$OPENVIDU_URL
OPENVIDU_SECRET=$OPENVIDU_SECRET
AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
FRONT_URL=$FRONT_URL
FAST_API=http://zipondev-ai:8000
ELASTICSEARCH_INDEX=zipon_properties

# --- AI Environment ---
GMS_KEY=$GMS_KEY
GMS_API_URL=$GMS_API_URL
MODEL_NAME=$MODEL_NAME
EOF2

              echo "[DEV] ✅ .env generated:"
              cat /home/ubuntu/zipon-app/.env

              echo "[DEV] 🚀 Starting docker compose..."
              docker compose --env-file /home/ubuntu/zipon-app/.env -f "$DEV_COMPOSE" up -d --force-recreate

              echo "[DEV] ⏳ Waiting for backend startup..."
              for i in $(seq 1 40); do
                CODE=$(curl -s -o /dev/null -w "%{http_code}" http://zipondev-backend:8080/v3/api-docs || true)
                if [ "$CODE" = "200" ]; then
                  echo "[DEV] ✅ Backend healthy (HTTP 200)"
                  exit 0
                fi
                echo "[DEV] ($i/40) Waiting... HTTP=$CODE"
                sleep 2
              done

              echo "[DEV] ❌ Health check failed, showing logs"
              docker logs zipondev-backend --tail 40 || true
              exit 1
            '''
          }
        }
      }
    }

    stage('Publish OpenAPI') {
      when { branch 'dev' }
      steps {
        sh '''
          set +e
          mkdir -p build
          echo "[SWAGGER] Fetching OpenAPI JSON..."
          curl -sf http://127.0.0.1:28080/v3/api-docs -o build/swagger.json || echo "[WARN] Swagger fetch failed, skipping"
          if [ -f build/swagger.json ]; then
            echo "[SWAGGER] ✅ Saved successfully (size: $(wc -c < build/swagger.json))"
          else
            echo "[SWAGGER] ⚠️ No swagger.json generated"
          fi
        '''
      }
    }

    stage('Deploy PROD') {
      when { anyOf { branch 'main'; branch 'master' } }
      steps {
        sh """
          echo "[PROD] 🚀 Deploying to production..."
          docker compose -f ${PROD_COMPOSE} up -d --force-recreate --remove-orphans
        """
      }
    }
  }

  post {
    success {
      echo "✅ Pipeline complete."
      sh 'docker system prune -f || true'
    }
    failure {
      echo "❌ Pipeline failed. Check above logs."
    }
  }
}
