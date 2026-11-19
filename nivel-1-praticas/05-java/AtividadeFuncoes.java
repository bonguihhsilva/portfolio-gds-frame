public class AtividadeFuncoes {

    // DESAFIO 1: Método void com o nome e mensagem corretos
    public static void exibirMensagem(String nome) {
        System.out.println("Olá, " + nome + "! Seja bem-vindo ao GDS-Frame !");
    }

    // DESAFIO 2: Método com retorno e o nome correto
    public static int calcularQuadrado(int numero) {
        int resultado = numero * numero;
        return resultado;
    }

    public static void main(String[] args) {
        // DESAFIO 3: Chamando a saudação com o seu nome
        exibirMensagem("José Maria");

        // DESAFIO 4: Calculando o quadrado de 4 e guardando o resultado
        int resultadoQuadrado = calcularQuadrado(2);

        // Imprimindo o resultado com uma mensagem explicativa
        System.out.println("O quadrado do número inserido é: " + resultadoQuadrado);
    }
}