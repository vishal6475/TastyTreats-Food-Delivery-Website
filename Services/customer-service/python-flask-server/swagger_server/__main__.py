#!/usr/bin/env python3

import connexion

from swagger_server import encoder
from flask_cors import CORS


def main():
    app = connexion.App(__name__, specification_dir='./swagger/')
    app.app.json_encoder = encoder.JSONEncoder
    app.add_api('swagger.yaml', arguments={'title': 'Swagger TastyTreat Restaurant API (OpenAPI 3.0)'}, pythonic_params=True)
    # adding for CORS support
    CORS(app.app)
    app.run(port=8080)


if __name__ == '__main__':
    main()
