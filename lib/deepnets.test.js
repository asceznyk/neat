var model = new NeuralNetwork();
model.layer({'type':'input', 'units':5});
model.layer({'type':'dense', 'units':10, 'activation':sigmoid});
model.layer({'type':'dense', 'units':2, 'activation':sigmoid});


