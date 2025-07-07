pipeline {
  agent local-agent

  environment {
      AWS_ACCESS_KEY_ID     = credentials('AWS_ACCESS_KEY_ID')
      AWS_SECRET_ACCESS_KEY = credentials('AWS_ACCESS_KEY_ID') // both use same ID (username/password)
      AWS_DEFAULT_REGION    = "${params.AWS_DEFAULT_REGION}" // or use param/environment value if set globally
      EB_APP_NAME           = "${params.EB_APP_NAME}"      // 🔁 your Elastic Beanstalk app name
      EB_ENV_NAME           = "${params.EB_ENV_NAME}"  // 🔁 your EB environment name
    }

  stages {
    stage('Checkout Code') {
      steps {
        checkout scm
      }
    }

    stage('Install Dependencies') {
      steps {
        bat 'npm install'
      }
    }

    stage('Build Angular App') {
      steps {
        bat 'npm run build:ssr'  // or 'npm run build' if using custom SSR script
      }
    }

    stage('Prepare Deploy Package') {
      steps {
        script {
          bat '''
          IF EXIST deploy.zip DEL deploy.zip
          mkdir deploy
          xcopy /E /I /Y Procfile deploy\\
          xcopy /E /I /Y package.json deploy\\
          xcopy /E /I /Y dist deploy\\dist\\
          powershell Compress-Archive -Path deploy\\* -DestinationPath deploy.zip
          '''
        }
      }
    }

    stage('Deploy to Elastic Beanstalk') {
      steps {
        bat """
        eb init %EB_APP_NAME% --platform "Node.js" --region %AWS_DEFAULT_REGION% --profile default
        eb use %EB_ENV_NAME%
        eb deploy --staged --profile default
        """
      }
    }
  }

  post {
    success {
      echo '✅ Angular frontend deployed successfully to AWS Elastic Beanstalk with SSR!'
    }
    failure {
      echo '❌ Deployment failed. Check Jenkins logs.'
    }
  }
}
