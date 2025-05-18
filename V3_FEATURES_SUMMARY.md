# Desktop Commander V3 - Complete Docker Service Support

## What's New in V3

### 🐳 Full Docker Service Support
V3 now properly handles BOTH ChromaDB and OpenSearch when they're running in Docker:

1. **Automatic Docker Detection**
   - Checks for ChromaDB containers (named `chroma` or `chromadb`)
   - Checks for OpenSearch containers (named `opensearch`)
   - Automatically uses the correct ports from Docker mappings

2. **Dynamic Port Configuration**
   - Reads actual port mappings from Docker
   - No hardcoded ports - uses whatever Docker exposes
   - Exports URLs to all MCP services

3. **Service Health Checks**
   - Tests if services are accessible before starting
   - Automatically restarts Docker containers if not responding
   - Waits for services to be fully ready

4. **Configuration Export**
   - Exports both `CHROMADB_URL` and `OPENSEARCH_URL`
   - Creates `.env` file with all service configurations
   - Passes environment variables to the launch script

## Helper Scripts

### Check Docker Services
```bash
./check-docker-services.sh
```
Shows:
- All running Docker containers
- ChromaDB status and API test
- OpenSearch status and cluster health
- Port usage summary
- Recommendations if services missing

### Fix OpenSearch Issues
```bash
./fix-opensearch.sh
```
Does:
- Checks if OpenSearch is in Docker
- Starts OpenSearch if not running
- Creates required indices
- Updates service configurations
- Shows final status

## Using V3

### Start Everything
```bash
dc start
```
This will:
1. Kill all existing processes
2. Check for Docker ChromaDB and use it
3. Check for Docker OpenSearch and use it
4. Export URLs to all services
5. Launch the ecosystem with proper configuration
6. Register Desktop Commander

### Check Status
```bash
dc status
```
Shows:
- Desktop Commander build status
- ChromaDB status (Docker or native)
- OpenSearch status (Docker or native)
- MCP Router status
- Registration status

### Stop Everything
```bash
dc stop
```
Cleanly stops all services

## Troubleshooting

### If Services Don't Start
1. Check Docker containers: `docker ps`
2. Run diagnostic: `./check-docker-services.sh`
3. Fix OpenSearch: `./fix-opensearch.sh`
4. Check logs: `docker logs chromadb` or `docker logs opensearch`

### Port Issues
- ChromaDB typically uses port 8000
- OpenSearch uses ports 9200 and 9600
- Check port usage: `lsof -i :8000` or `lsof -i :9200`

### Service URLs
After starting, services will be available at:
- ChromaDB: `http://localhost:<docker-mapped-port>`
- OpenSearch: `http://localhost:<docker-mapped-port>`
- Dashboard: `http://localhost:3001`
- MCP Router: `http://localhost:3099`

## Key Improvements
- No hardcoded ports - reads from Docker
- Automatic service restart if not responding
- Proper environment variable export
- Better error messages and status reporting
- Production-grade reliability

Your Desktop Commander now seamlessly integrates with Docker services!