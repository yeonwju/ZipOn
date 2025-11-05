pipeline {
  agent any

  environment {
    DOCKER_OPTS = ""
    HEALTH = "/usr/local/bin/zipon-health.sh"
    PROD_COMPOSE = "/home/ubuntu/zipon-app/docker-compose.service.yml"
    DEV_COMPOSE  = "/home/ubuntu/zipon-app/docker-compose.dev.yml"

    SPRING_DATASOURCE_URL = credentials('SPRING_DATASOURCE_URL')
    SPRING_DATASOURCE_USERNAME = credentials('SPRING_DATASOURCE_USERNAME')
    SPRING_DATASOURCE_PASSWORD = credentials('SPRING_DATASOURCE_PASSWORD')
    GOOGLE_CLIENT_ID = credentials('GOOGLE_CLIENT_ID')
    GOOGLE_CLIENT_SECRET = credentials('GOOGLE_CLIENT_SECRET')
    SSAFY_API_KEY = credentials('SSAFY_API_KEY')
    SSAFY_API_URL = credentials('SSAFY_API_URL')
    GOV_API_KEY = credentials('GOV_API_KEY')
    BIZNO_API_KEY = credentials('BIZNO_API_KEY')
    BIZNO_API_URL = credentials('BIZNO_API_URL')
    REDIS_PASSWORD = credentials('REDIS_PASSWORD')
  }

  options {
    buildDiscarder(logRotator(numToKeepStr: '20'))
    // timestamps()
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        sh 'git rev-parse --short HEAD > .gitsha'
      }
    }

    stage('Resolve Env URLs') {
      steps {
        script {
          env.DEV_API_BASE_URL  = 'https://dev-zipon.duckdns.org/api'
          env.PROD_API_BASE_URL = 'https://zipon.duckdns.org/api'

          if (env.BRANCH_NAME == 'dev') {
            env.FRONT_API_BASE_URL = env.DEV_API_BASE_URL
          } else if (env.BRANCH_NAME == 'master' || env.BRANCH_NAME == 'main') {
            env.FRONT_API_BASE_URL = env.PROD_API_BASE_URL
          } else {
            env.FRONT_API_BASE_URL = env.DEV_API_BASE_URL
          }

          echo "Using FRONT_API_BASE_URL = ${env.FRONT_API_BASE_URL}"
        }
      }
    }

    stage('Build Images (parallel)') {
      steps {
        script {
          def gitsha = sh(script: 'cat .gitsha', returnStdout: true).trim()

          parallel failFast: false,
          FRONTEND: {
            sh """
              docker build ${env.DOCKER_OPTS} \
                --build-arg NEXT_PUBLIC_API_BASE_URL=${env.FRONT_API_BASE_URL} \
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

              # (옵션) 간단 헬스체크
              curl -s -o /dev/null -w "DEV FRONT / -> %{http_code}\\n" https://dev-zipon.duckdns.org/
              curl -s -o /dev/null -w "DEV BACK /api/ -> %{http_code}\\n" https://dev-zipon.duckdns.org/api/
              curl -s -o /dev/null -w "DEV AI /ai/ -> %{http_code}\\n" https://dev-zipon.duckdns.org/ai/
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

          curl -s -o /dev/null -w "PROD FRONT / -> %{http_code}\\n" https://zipon.duckdns.org/
          curl -s -o /dev/null -w "PROD BACK /api/ -> %{http_code}\\n" https://zipon.duckdns.org/api/
          curl -s -o /dev/null -w "PROD AI /ai/ -> %{http_code}\\n" https://zipon.duckdns.org/ai/
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
