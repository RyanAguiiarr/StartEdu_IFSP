package Ryan.StartEdu.model;

public class ApiResponse<T> {

    private boolean sucesso;
    private String mensagem;
    private T dados;

    public ApiResponse(boolean sucesso, String mensagem, T dados) {
        this.sucesso = sucesso;
        this.mensagem = mensagem;
        this.dados = dados;
    }

    public ApiResponse() {
    }

    public boolean isSucesso() {
        return sucesso;
    }

    public void setSucesso(boolean sucesso) {
        this.sucesso = sucesso;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }

    public T getDados() {
        return dados;
    }

    public void setDados(T dados) {
        this.dados = dados;
    }
}
