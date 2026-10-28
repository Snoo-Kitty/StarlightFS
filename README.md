# Starlight File Storage
Application for viewing specific files made for devices on the same network

# .env variables
| Field           | Value                                                        | Type |
|-----------------|--------------------------------------------------------------|------|
| IP              | The IP of where it will be hosted (0.0.0.0 by default)       | str  |
| PORT            | The port of the host IP (80 by default)                      | str  |
| DATABASE_URL    | The mongoDB url                                              | str  |
| FILE_SIZE_LIMIT | The limit accepted for multipart files uploaded in gigabytes | str  |