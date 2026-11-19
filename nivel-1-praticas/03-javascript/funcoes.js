//declaracao de funcao simples

function saudacao(){
        console.log("Ola, mundo!")
}

// chamada da funcao
saudacao ()

// 2 - passando parametros para a funcao

// declaracao da funcao que recebe parametro
function novaSaudacao(nome) {
        console.log(`Ola, ${nome}! Seja Bem-Vindo`);
}

// chamado da funcao com diferentes nomes
novaSaudacao("Carlos")
novaSaudacao("Guilherme")
novaSaudacao("Laura")

// 3 - funcao com retorno de valores

// declaracao da funcao com soma
function soma(a, b) { 
    return a + b;
}

// chamada para a funcao
console.log("Resultado da soma de 5 + 3", soma(5, 3))
console.log("Resultado da soma de 7 + 4", soma(7, 4))
console.log("Resultado da soma de 20 + -13", soma(20, -13))