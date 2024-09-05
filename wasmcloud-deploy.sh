LOC=`pwd`
cd ${LOC}/jug-component-rust
wash build
wash app undeploy wadm.yaml
wash app deploy wadm.yaml
cd ${LOC}