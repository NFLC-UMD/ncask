#!/bin/bash


HOST=$(kubectl get nodes --namespace default -o jsonpath='{.items[0].status.addresses[0].address}')
PORT=$(kubectl get svc --namespace default good-rat-express-gateway-admin -o jsonpath='{.spec.ports[0].nodePort}')
