# Create database
`sqlcmd -S 127.0.0.1,21433 -U sa -P E@syP@ssw0rd -Q "CREATE DATABASE [publicserviceregistry-dev];"`

# Import files
`bcp PublicServiceRegistry.Messages in ./dvr-messages.txt -S 127.0.0.1,21433 -U sa -d publicserviceregistry-dev -c -t '|' -P E@syP@ssw0rd -E`

`bcp PublicServiceRegistry.Streams in ./dvr-streams.txt -S 127.0.0.1,21433 -U sa -d publicserviceregistry-dev -c -t '|' -P E@syP@ssw0rd -E`

