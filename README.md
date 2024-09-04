# Run Redis instance
```` 
docker run -d --name redis -p 6379:6379 redis
````

# Start Wasmcloud 
```` 
wash up
````

# Build and deploy Jug component

Inside jug-component folder 

````
wash build
````

then 

````
wash app deploy wadm.yaml
````

# Run backend :3000

````
node index.js
````

# Serve frontend :8080

````
http-server .
````
