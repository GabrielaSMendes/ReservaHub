# Como Executar o ReservaHub

Guia passo a passo para configurar e executar a aplicação localmente.

---

## Pré-requisitos

Certifique-se de ter instalado:

- **Java 21** — [https://adoptium.net](https://adoptium.net)
- **Node.js 18+** (inclui npm) — [https://nodejs.org](https://nodejs.org)
- **MySQL 8.0+** — [https://dev.mysql.com/downloads/mysql](https://dev.mysql.com/downloads/mysql)
- **Git**

Para verificar as versões instaladas:

```cmd
java -version
node -v
npm -v
mysql --version
```

---

## 1. Clonar o Repositório

```cmd
git clone https://github.com/GabrielaSMendes/ReservaHub.git
cd ReservaHub
```

---

## 2. Executar com o script automático (recomendado)

Na raiz do projeto, clique duas vezes em **`iniciar.cmd`** ou rode no terminal:

```cmd
iniciar.cmd
```

O script vai automaticamente:

1. Verificar se Java, Node.js e MySQL estão instalados
2. Criar o banco `reserva_hub` (se não existir) e importar o schema
3. Perguntar se deseja carregar dados de teste
4. Iniciar o backend em uma janela separada e aguardar ele subir
5. Instalar dependências npm (apenas na primeira execução)
6. Iniciar o frontend em outra janela
7. Abrir o navegador em `http://localhost:5173`

> **Credenciais do banco:** O script usa `root` / `12345678` por padrão.
> Se as suas forem diferentes, edite as linhas `DB_USER` e `DB_PASS` no topo do `iniciar.cmd`
> e também o arquivo `ReservaHub-backend/src/main/resources/application.properties`.

---

## 3. Execução manual (alternativa)

Caso prefira iniciar cada parte separadamente:

### 3.1. Configurar o Banco de Dados

Acesse o MySQL e crie o banco:

```cmd
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS reserva_hub;"
```

Importe o schema:

```cmd
mysql -u root -p reserva_hub < ReservaHub-database\reserva_hub.sql
```

(Opcional) Carregar dados de teste:

```cmd
mysql -u root -p reserva_hub < ReservaHub-database\popular_dados_teste.sql
```

### 3.2. Iniciar o Backend

```cmd
cd ReservaHub-backend
mvnw.cmd spring-boot:run
```

Aguarde a mensagem de inicialização. Backend disponível em `http://localhost:8080`.

### 3.3. Iniciar o Frontend

Em outro terminal:

```cmd
cd ReservaHub-frontend
npm install
npm run dev
```

Frontend disponível em `http://localhost:5173`.

---

## Resumo das Portas

| Serviço   | Porta | URL                                    |
|-----------|-------|----------------------------------------|
| Frontend  | 5173  | http://localhost:5173                  |
| Backend   | 8080  | http://localhost:8080                  |
| MySQL     | 3306  | localhost:3306                         |
| Swagger   | 8080  | http://localhost:8080/swagger-ui.html  |

---

## Problemas Comuns

**`[ERRO] Java nao encontrado`**
Verifique se o Java 21 está instalado e a variável `JAVA_HOME` está configurada.

**`[ERRO] Nao foi possivel conectar ao MySQL`**
Confirme que o serviço MySQL está rodando e que as credenciais no `iniciar.cmd` e no `application.properties` estão corretas.

**`[ERRO] MySQL nao encontrado no PATH`**
Adicione o diretório `bin` do MySQL ao PATH do Windows (ex: `C:\Program Files\MySQL\MySQL Server 8.0\bin`).

**Porta 8080 em uso**
Verifique e encerre o processo que está usando a porta:
```cmd
netstat -ano | findstr :8080
taskkill /PID <numero_do_pid> /F
```

**Frontend não comunica com o backend**
Confirme que a janela do backend está rodando antes de acessar o frontend. O proxy do Vite só funciona com o backend ativo.
