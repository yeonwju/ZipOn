pipeline {
  agent any

  environment {
    DOCKER_OPTS   = "--pull"
    HEALTH        = "/usr/local/bin/zipon-health.sh"
    DEV_COMPOSE   = "/home/ubuntu/zipon-app/docker-compose.dev.yml"
    DEV_FRONT_URL = "https://dev-zipon.duckdns.org/"
    DEV_BACK_URL  = "https://dev-zipon.duckdns.org/api/"
    DEV_AI_URL    = "https://dev-zipon.duckdns.org/ai/"
  }

  options {
    timestamps()
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
          parallel(
            FRONTEND: { sh "docker build ${env.DOCKER_OPTS} -t zipon-frontend:latest -t zipon-frontend:\$(cat .gitsha) ./frontend" },
            BACKEND : { sh "docker build ${env.DOCKER_OPTS} -t zipon-backend:latest  -t zipon-backend:\$(cat .gitsha)  ./backend" },
            AI      : { sh "docker build ${env.DOCKER_OPTS} -t zipon-ai:latest       -t zipon-ai:\$(cat .gitsha)       ./ai" }
          )
        }
      }
    }


    stage('Unit Tests') {
      steps {
        sh """
          echo "[TEST] 여기에 실제 테스트 명령 넣기"
          # 예시:
          # (cd frontend && npm ci && npm test)
          # (cd backend && ./gradlew test)
          # (cd ai && pytest)
        """
      }
    }

    stage('Deploy DEV') {
      steps {
        sh """
          test -f ${env.DEV_COMPOSE} || { echo "[DEV] compose가 없습니다: ${env.DEV_COMPOSE}"; exit 1; }

          echo "[DEV] Deploying with ${env.DEV_COMPOSE}"
          docker compose -f ${env.DEV_COMPOSE} up -d --force-recreate --remove-orphans

          echo "[DEV] Warm-up & health check..."
          sleep 2
          if [ -x ${env.HEALTH} ]; then ${env.HEALTH} || true; fi

          curl -s -o /dev/null -w "FRONT /    -> %{http_code}\\n" ${env.DEV_FRONT_URL}
          curl -s -o /dev/null -w "BACK  /api/-> %{http_code}\\n" ${env.DEV_BACK_URL}
          curl -s -o /dev/null -w "AI    /ai/ -> %{http_code}\\n" ${env.DEV_AI_URL}
        """
      }
    }
  }

  post {
    success { echo "✅ DEV pipeline success" }
    failure { echo "❌ DEV pipeline failed" }
    always  { sh 'docker image prune -f || true' }
  }
}
