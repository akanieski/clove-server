module.exports = {
  "development": {
    "dialect": "sqlite",
    "storage": "./db.development.sqlite",
    "password_reset_url": "http://127.0.0.1:8080/#/password_reset",
    "endpoint_port": 4444,
    "secret":  "dev-secret",
    "allow_tests": true,
    "smtp": {
      "system": {
        "user": "andrew.legacy@gmail.com", 
        "password": "wyndin00", 
        "host": "smtp.gmail.com", 
        "ssl": true,
        "type": "smtp"
      }
    },
    "password_strength": {
      "minLength": 8,
      "specialCharacters": true,
      "capitals": true
    }
  },
  "test": { 
    "ssl": {
        "key": "./certs/self-signed.key",
        "crt": "./certs/self-signed.crt"
    },
    "logging": false,
    "endpoint_port": 5555,
    "secret":  "test-secret",
    "allow_tests": true,
    "password_reset_url": "http://127.0.0.1:8080/#/password_reset",
    "smtp": {
      "system": {
        "type": "test"
      }
    },
    "password_strength": {
      "minLength": 8,
      "specialCharacters": true,
      "capitals": true
    }
  },
  "test-aws": { 
    "ssl": {
        "key": "./certs/self-signed.key",
        "crt": "./certs/self-signed.crt"
    },
    "logging": false,
    "endpoint_port": 5555,
    "secret":  "test-secret",
    "allow_tests": true,
    "password_reset_url": "http://127.0.0.1:8080/#/password_reset",
    "smtp": {
      "system": {
        "type": "test"
      }
    },
    "password_strength": {
      "minLength": 8,
      "specialCharacters": true,
      "capitals": true
    }
  },
  "test-azure": { 
    "ssl": {
        "key": "./certs/self-signed.key",
        "crt": "./certs/self-signed.crt"
    },
    "logging": false,
    "endpoint_port": 5555,
    "secret":  "test-secret",
    "allow_tests": true,
    "password_reset_url": "http://127.0.0.1:8080/#/password_reset",
    "smtp": {
      "system": {
        "type": "test"
      }
    },
    "password_strength": {
      "minLength": 8,
      "specialCharacters": true,
      "capitals": true
    }
  },
  "production": {
    "endpoint_port": 80,
    "dialect": "sqlite",
    "storage": "./db.production.sqlite",
    "secret":  "prod-secret"
  }
}