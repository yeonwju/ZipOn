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
    NEXT_PUBLIC_KAKAO_MAP_API_KEY = credentials('NEXT_PUBLIC_KAKAO_MAP_API_KEY')
    NEXT_PUBLIC_PWA_ENABLE = '1'
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
            sh "docker build ${env.DOCKER_OPTS} -t zipon-ai:latest -t zipon-ai:${gitsha} ./ai"
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
              echo "[DEV] Deploying with ${env.DEV_COMPOSE}"
              docker compose -f ${env.DEV_COMPOSE} up -d --force-recreate --remove-orphans
            """
          } else {
            echo "[DEV] ${env.DEV_COMPOSE} not found. Skipping deploy."
          }
        }
      }
    }

    stage('Deploy PROD') {
      when { anyOf { branch 'main'; branch 'master' } }
      steps {
        sh """
          echo "[PROD] Deploying with ${env.PROD_COMPOSE}"
          docker compose -f ${env.PROD_COMPOSE} up -d --force-recreate --remove-orphans

          echo "[PROD] Warm-up & health check..."
          sleep 3
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
    success { echo "✅ Pipeline success" }
    failure { echo "❌ Pipeline failed. Check above logs." }
    always  { sh 'docker image prune -f || true' }
  }
}
