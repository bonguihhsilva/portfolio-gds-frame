let minhaPromessa = new Promise((resolve, reject) => {
	let sucesso = true;

	if (sucesso) {
		resolve('Sucesso!');
	} else {
		reject('Erro!');
	}
});

minhaPromessa
	.then((resultado) => {
		console.log(resultado);
	})
	.catch((erro) => {
		console.error(erro);
	})
	.finally(() => {
		console.log('Operação concluída');
	});
