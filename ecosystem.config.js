module.exports = {
    apps: [{
        "name": "Document Sharer",
        "instances": 1,
        "script": "./bin/www",
        "watch": false,
        "ignore_watch": [
            "node_modules",
            "logs",
            ".git"
        ],
        "error_file": "./logs/errors.log",
        "out_file": "./logs/errors_out.log",
        "log_date_format": "YYYY-MM-DD HH:mm Z",
        env: {
            "NODE_ENV": "development",
        },
        env_production: {
            "NODE_ENV": "production",
            "ENVIRONMENT": "production",
            "PORT": "8002"
        }
    }]
}