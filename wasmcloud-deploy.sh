LOC=`pwd`

cd ${LOC}/jug-component-rust
wash build
wash app undeploy wadm.yaml
wash app deploy wadm.yaml

cd ${LOC}/jug-component-go
wash build
wash app undeploy wadm.yaml
wash app deploy wadm.yaml

cd ${LOC}/jug-component-typescript
wash build
wash app undeploy wadm.yaml
wash app deploy wadm.yaml

cd ${LOC}/jug-component-c
wash build
wash app undeploy wadm.yaml
wash app deploy wadm.yaml

cd ${LOC}