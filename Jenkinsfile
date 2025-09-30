pipeline {
  agent any // Ensure this agent has: docker, gcloud (with gsutil/kubectl), and kubectl configured or installable

  options {
    timestamps()
    ansiColor('xterm')
    buildDiscarder(logRotator(numToKeepStr: '30'))
    disableConcurrentBuilds()
  }

  environment {
    // ---- Customize as needed ----
    REGISTRY = "gcr.io/erpnext-454112"
    IMAGE    = "deviceflow-website"
    TAG      = "latest"
    DEPLOYMENT_NAME= 'deviceflow-website'
    NAMESPACE      = 'applications'

    // GCP / GKE details (used for auth & kubectl context)
    GCP_PROJECT    = 'erpnext-454112'
    GKE_CLUSTER    = 'edify'    // e.g. "primary-cluster"
    GKE_LOCATION   = 'asia-south1'              // zone OR region, e.g. "asia-south1-a" or "asia-south1"

    // Docker build
    DOCKER_BUILDKIT = '1'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('GCloud Auth & Setup') {
      steps {
        withCredentials([file(credentialsId: 'gcp-sa-key', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
          sh '''
            set -euxo pipefail
            gcloud auth activate-service-account --key-file="$GOOGLE_APPLICATION_CREDENTIALS"
            gcloud --quiet config set project "$GCP_PROJECT"

            # Docker / gsutil / kubectl
            gcloud auth configure-docker gcr.io,asia.gcr.io,us.gcr.io,eu.gcr.io --quiet || true
            gcloud components install kubectl -q || true

            # Get kubecontext (try zone then region)
            gcloud container clusters get-credentials "$GKE_CLUSTER" --zone="$GKE_LOCATION" --project="$GCP_PROJECT" || \
            gcloud container clusters get-credentials "$GKE_CLUSTER" --region="$GKE_LOCATION" --project="$GCP_PROJECT"
          '''
        }
      }
    }


    stage('Docker Build') {
      steps {
        withCredentials([file(credentialsId: 'env-production-file-deviceflow', variable: 'ENV_FILE')]) {
          sh '''
            set -eu
            : "${REGISTRY:?REGISTRY is empty}"
            : "${IMAGE:?IMAGE is empty}"
            : "${TAG:?TAG is empty}"

            export DOCKER_BUILDKIT=1
            docker build --progress=plain \
              --secret id=envprod-deviceflow,src="$ENV_FILE" \
              -t "$REGISTRY/$IMAGE:$TAG" .
          '''
        }
      }
    }

    // stage('Push Image to GCR') {
    //   steps {
    //     sh '''
    //       echo "🚀 Pushing image to GCR..."
    //       docker push "$IMAGE"
    //     '''
    //   }
    // }

    // stage('Restart GKE Deployment') {
    //   steps {
    //     sh '''
    //       echo "🔁 Restarting GKE deployment: $DEPLOYMENT_NAME in namespace: $NAMESPACE"
    //       kubectl rollout restart "deployment/$DEPLOYMENT_NAME" -n "$NAMESPACE"
    //     '''
    //   }
    // }
  }

  post {
    success {
      echo "✅ Production deployment complete!"
    }
    always {
      sh 'docker image prune -f || true'
    }
  }
}
