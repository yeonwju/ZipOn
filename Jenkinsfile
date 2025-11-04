pipeline {
  agent any

  environment {
    DOCKER_OPTS = "--pull"
    HEALTH = "/usr/local/bin/zipon-health.sh"
    PROD_COMPOSE = "/home/ubuntu/zipon-app/docker-compose.service.yml"

    SPRING_DATASOURCE_URL = credentials('SPRING_DATASOURCE_URL')       // jdbc:postgresql://zipondev-db:5432/appdb
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

    stage('Build Images (parallel)') {
      steps {
        script {
          def gitsha = sh(script: 'cat .gitsha', returnStdout: true).trim()
          parallel failFast: false,
          FRONTEND: { sh "docker build ${env.DOCKER_OPTS} -t zipon-frontend:latest -t zipon-frontend:${gitsha} ./frontend" },
          BACKEND:  { sh "docker build ${env.DOCKER_OPTS} -t zipon-backend:latest  -t zipon-backend:${gitsha}  ./backend"  },
          AI:       { sh "docker build ${env.DOCKER_OPTS} -t zipon-ai:latest       -t zipon-ai:${gitsha}       ./ai"       }
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