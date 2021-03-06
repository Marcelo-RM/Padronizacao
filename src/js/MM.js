/**
 * Objeto principal da classe
 * será usado para chamar todos os métodos
 */
var MM = {
    showBusy: _showBusy,
    hideBusy: _hideBusy,
    alert: _alert
};
/**
 * Private metodo para exibição de busy
 */
function _showBusy() {
    var busy = document.getElementById('MM-Busy');
    if (!busy) {
        //cria style tag usada no busy
        createBusyStyle();
        var newBusy = document.createElement("div");
        newBusy.id = "MM-Busy";
        newBusy.className = "MM-Busy";
        //divs que serão as bolhas
        var bubble01 = document.createElement("div");
        var bubble02 = document.createElement("div");
        var bubble03 = document.createElement("div");
        //adiciona todas as bolhas ao busy pai
        newBusy.appendChild(bubble01);
        newBusy.appendChild(bubble02);
        newBusy.appendChild(bubble03);
        //adiciona busy ao body da pagina
        document.getElementsByTagName("body")[0].appendChild(newBusy);
    }
    else {
        //altera a visão do busy existente para flex
        busy.style.display = "flex";
    }
}
/**
 * Private metodo para ocultação do busy
 * altera a visão do busy existente para none
 */
function _hideBusy() {
    var busy = document.getElementById('MM-Busy');
    busy.style.display = "none";
}
/**
 * Exibe o modal como um alert
 * @param {object} options contem propriedades importantes
 * type "string", title "string", text "string"
 * buttons "array de objetos" [{text "string", type: "string", action: "function"}]
 */
function _alert(options) {
    //verifica se já existe um modal
    var modal = document.getElementById('MM-Modal');
    if (!modal) {
        //cria style tag usada no modal
        createModelStyle();
        //cria elemento principal do modal
        modal = document.createElement("div");
        modal.className = "MM-Modal";
        //cria o item visivel do modal, conteudo
        var modalContent = document.createElement("div");
        modalContent.className = "MM-ModalContent";
        //cria o cabeçalho do modal, icone e titulo
        var modalHeader = document.createElement("div");
        modalHeader.className = "MM-ModalContentHeader";
        //todos icones já vem definido com tamanho e posicao com classe generica
        var icon = document.createElement("span");
        icon.className = "MM-IconModal";
        var title = document.createElement("text");
        //conteudo do modal, texto central
        var modalBody = document.createElement("div");
        modalBody.className = "MM-ModalContentBody";
        //footer do modal, container para buttons
        var modalFooter = document.createElement("div");
        modalFooter.className = "MM-ModalContentFooter";
        //Montar model
        modalHeader.appendChild(icon);
        modalHeader.appendChild(title);
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modalContent.appendChild(modalFooter);
        //adiciona todo conteudo do modal ao container principal
        modal.appendChild(modalContent);
    }
    try {
        //Cor da borda de acordo com o tipo
        modalContent.style.borderColor = _getColorByType(options.type).bg;
        //Definindo conteudo para o header
        icon.style.color = _getColorByType(options.type).bg;
        icon.classList.add(_getIconClassByType(options.type));
        title.innerText = options.title;
        //Conteudo principal da notificacao
        modalBody.innerText = options.text;
        //Botoes do footer
        //Verifica se foi passado algum botão, se sim cria com as propriedades recebidas
        if (options.buttons && options.buttons.length > 0) {
            //define propriedades para cada botão
            for (var i = 0; i < options.buttons.length; i++) {
                var btn = document.createElement("button");
                //cria metodo para clique, fecha o modal e executa função recebida
                btn.onclick = _createFunctionToButton(options.buttons[i].action, modal);
                btn.innerText = options.buttons[i].text;
                btn.style.backgroundColor = _getColorByType(options.buttons[i].type).bg;
                btn.style.color = _getColorByType(options.buttons[i].type).ft;
                modalFooter.appendChild(btn);
            }
        }
        else {
            //caso não receba nenhum botão como parametro cria um default para fechar o modal
            var btn = document.createElement("button");
            //primeiro parametro seria a função recebida
            btn.onclick = _createFunctionToButton(null, modal);
            btn.innerText = 'Ok';
            btn.style.backgroundColor = _getColorByType('default').bg;
            btn.style.color = _getColorByType('default').ft;
            modalFooter.appendChild(btn);
        }
        //Se já existe um modal criado exclui ele do html
        if (document.getElementById('MM-Modal')) {
            document.removeChild(document.getElementById('MM-Modal'));
        }
        //adiciona o modal criado acima no body
        document.getElementsByTagName('body')[0].appendChild(modal);
    }
    catch (error) {
        //caso haja algum erro nos parametros exibe no console
        console.error(error + "\n Erro na chamada de método, verifique todos os parametros passados! \n É obrigatório um objeto como parametro contendo um type, um title, e um text!");
    }
}
/**
 * recebe cores para definir layout do modal e botoes
 * @param {string} type estilo do modal
 * @return {Object} contendo uma cor de background e uma cor de font
 */
function _getColorByType(type) {
    if (type == "info") {
        return { bg: "#0058AE", ft: "#fff" };
    }
    if (type == "success") {
        return { bg: "#00bd72", ft: "#fff" };
    }
    if (type == "warning") {
        return { bg: "#FFBF00", ft: "#fff" };
    }
    if (type == "error") {
        return { bg: "#ED1C24", ft: "#fff" };
    }
    return { bg: "#DDD", ft: "#333" };
}
/**
 * Recebe uma classe que exibe um icone
 * @param {string} type estilo do modal
 * @return {string} class usada para definir o icone exibido
 */
function _getIconClassByType(type) {
    if (type == "info") {
        return "MM-IconInfo";
    }
    if (type == "success") {
        return "MM-IconSuccess";
    }
    if (type == "warning") {
        return "MM-IconAlert";
    }
    if (type == "error") {
        return "MM-IconError";
    }
    return "MM-IconInfo";
}
/**
 * funcão usada para executar funcao default que fecha modal e funcao desejada pelo dev
 * @param {function} func função recebida por parametro que será executa em clique
 * @param {htmlObject} modal modal principal que está sendo criado
 * @return {function} funcao que executa as duas funcoes
 */
function _createFunctionToButton(func, modal) {
    return function () {
        if (func) {
            func();
        }
        _closeModal(modal);
    };
}
/**
 * função usada para fechar o modal criado
 * @param {htmlObject} modal modal principal que está sendo criado
 */
function _closeModal(modal) {
    modal.children[0].style.animation = "hide 0.5s normal 0s ease-in";
    //usando set timout para aguardar a animação terminar
    setTimeout(function () {
        document.getElementsByTagName('body')[0].removeChild(modal);
    }, 490);
}
/**
 * Método utilizado para criar tag style contendo estilos usado pelo busy
 */
function createModelStyle() {
    //DEFININDO CSS PARA MODAL
    var _modalCss = ".MM-Modal{background-color:rgba(0,0,0,.3);margin:0;padding:0;position:fixed;display:flex;justify-content:center;align-items:center;top:0;width:100%;max-width:1240px;height:100%;z-index:1000}.MM-ModalContent{max-width:360px;margin:0 50px;background-color:#fafafa;border-radius:5px;border:1px solid;box-shadow:0 3px 8px 0 rgba(0,0,0,.2);animation:show .5s normal 0s ease-out}@keyframes show{0%{transform:scale(0)}80%{transform:scale(1.3)}100%{transform:scale(1)}}@keyframes hide{0%{transform:scale(1)}20%{transform:scale(1.3)}100%{transform:scale(0)}}.MM-ModalContentHeader{font-size:22px;font-weight:700;display:flex;align-items:center;padding-top:0;padding-left:30px;margin-bottom:10px;padding-top:15px;margin-left:20px;margin-right:20px}.MM-ModalContentHeader span{font-size:40px;position:absolute;margin-left:-30px}.MM-ModalContentBody{margin:0 20px;padding-bottom:15px}.MM-ModalContentFooter{border-top:1px solid #ddd;padding:15px;display:flex;justify-content:flex-end}.MM-ModalContentFooter button{padding:6px 12px;margin:5px;font-size:14px;font-weight:400;line-height:1.42857143;text-align:center;white-space:nowrap;vertical-align:middle;-ms-touch-action:manipulation;touch-action:manipulation;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;background-image:none;border:0;border-radius:3px;outline:0}.MM-ModalContentFooter button:hover{background-color:#bdc3c7}.MM-IconModal{width:25px;height:25px;background-position:center;background-repeat:no-repeat;background-size:contain}.MM-IconSuccess{background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE4LjEuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMzIuMjk2IDMyLjI5NiIgZmlsbD0iI2MzZTc2ZiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzIuMjk2IDMyLjI5NjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPHBhdGggc3R5bGU9ImZpbGw6I2MzZTc2ZjsiIGQ9Ik0zMS45MjMsOS4xNEwxMy40MTcsMjcuNjQyYy0wLjQ5NiwwLjQ5NC0xLjI5OSwwLjQ5NC0xLjc5MywwTDAuMzcsMTYuMzE2DQoJCWMtMC40OTQtMC40OTYtMC40OTQtMS4zMDIsMC0xLjc5NWwyLjY4OS0yLjY4N2MwLjQ5Ni0wLjQ5NSwxLjI5OS0wLjQ5NSwxLjc5MywwbDcuNjc4LDcuNzI5TDI3LjQzOCw0LjY1NA0KCQljMC40OTQtMC40OTQsMS4yOTctMC40OTQsMS43OTUsMGwyLjY4OSwyLjY5MUMzMi40MjEsNy44NCwzMi40MjEsOC42NDYsMzEuOTIzLDkuMTR6Ii8+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8L3N2Zz4NCg==)}.MM-IconAlert{background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUxMiA1MTIiIGZpbGw9IiNmZmNkMDAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxnPg0KCQk8cGF0aCBkPSJNNTA3LjQ5NCw0MjYuMDY2TDI4Mi44NjQsNTMuNTM3Yy01LjY3Ny05LjQxNS0xNS44Ny0xNS4xNzItMjYuODY1LTE1LjE3MmMtMTAuOTk1LDAtMjEuMTg4LDUuNzU2LTI2Ljg2NSwxNS4xNzINCgkJCUw0LjUwNiw0MjYuMDY2Yy01Ljg0Miw5LjY4OS02LjAxNSwyMS43NzQtMC40NTEsMzEuNjI1YzUuNTY0LDkuODUyLDE2LjAwMSwxNS45NDQsMjcuMzE1LDE1Ljk0NGg0NDkuMjU5DQoJCQljMTEuMzE0LDAsMjEuNzUxLTYuMDkzLDI3LjMxNS0xNS45NDRDNTEzLjUwOCw0NDcuODM5LDUxMy4zMzYsNDM1Ljc1NSw1MDcuNDk0LDQyNi4wNjZ6IE0yNTYuMTY3LDE2Ny4yMjcNCgkJCWMxMi45MDEsMCwyMy44MTcsNy4yNzgsMjMuODE3LDIwLjE3OGMwLDM5LjM2My00LjYzMSw5NS45MjktNC42MzEsMTM1LjI5MmMwLDEwLjI1NS0xMS4yNDcsMTQuNTU0LTE5LjE4NiwxNC41NTQNCgkJCWMtMTAuNTg0LDAtMTkuNTE2LTQuMy0xOS41MTYtMTQuNTU0YzAtMzkuMzYzLTQuNjMtOTUuOTI5LTQuNjMtMTM1LjI5MkMyMzIuMDIxLDE3NC41MDUsMjQyLjYwNSwxNjcuMjI3LDI1Ni4xNjcsMTY3LjIyN3oNCgkJCSBNMjU2LjQ5OCw0MTEuMDE4Yy0xNC41NTQsMC0yNS40NzEtMTEuOTA4LTI1LjQ3MS0yNS40N2MwLTEzLjg5MywxMC45MTYtMjUuNDcsMjUuNDcxLTI1LjQ3YzEzLjU2MiwwLDI1LjE0LDExLjU3NywyNS4xNCwyNS40Nw0KCQkJQzI4MS42MzgsMzk5LjExLDI3MC4wNiw0MTEuMDE4LDI1Ni40OTgsNDExLjAxOHoiLz4NCgk8L2c+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8L3N2Zz4NCg==)}.MM-IconError{width:20px;height:20px;background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDQ5MiA0OTIiIGZpbGw9IiNlMjI1MWQiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ5MiA0OTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxnPg0KCQk8cGF0aCBkPSJNMzAwLjE4OCwyNDZMNDg0LjE0LDYyLjA0YzUuMDYtNS4wNjQsNy44NTItMTEuODIsNy44Ni0xOS4wMjRjMC03LjIwOC0yLjc5Mi0xMy45NzItNy44Ni0xOS4wMjhMNDY4LjAyLDcuODcyDQoJCQljLTUuMDY4LTUuMDc2LTExLjgyNC03Ljg1Ni0xOS4wMzYtNy44NTZjLTcuMiwwLTEzLjk1NiwyLjc4LTE5LjAyNCw3Ljg1NkwyNDYuMDA4LDE5MS44Mkw2Mi4wNDgsNy44NzINCgkJCWMtNS4wNi01LjA3Ni0xMS44Mi03Ljg1Ni0xOS4wMjgtNy44NTZjLTcuMiwwLTEzLjk2LDIuNzgtMTkuMDIsNy44NTZMNy44NzIsMjMuOTg4Yy0xMC40OTYsMTAuNDk2LTEwLjQ5NiwyNy41NjgsMCwzOC4wNTINCgkJCUwxOTEuODI4LDI0Nkw3Ljg3Miw0MjkuOTUyYy01LjA2NCw1LjA3Mi03Ljg1MiwxMS44MjgtNy44NTIsMTkuMDMyYzAsNy4yMDQsMi43ODgsMTMuOTYsNy44NTIsMTkuMDI4bDE2LjEyNCwxNi4xMTYNCgkJCWM1LjA2LDUuMDcyLDExLjgyNCw3Ljg1NiwxOS4wMiw3Ljg1NmM3LjIwOCwwLDEzLjk2OC0yLjc4NCwxOS4wMjgtNy44NTZsMTgzLjk2LTE4My45NTJsMTgzLjk1MiwxODMuOTUyDQoJCQljNS4wNjgsNS4wNzIsMTEuODI0LDcuODU2LDE5LjAyNCw3Ljg1NmgwLjAwOGM3LjIwNCwwLDEzLjk2LTIuNzg0LDE5LjAyOC03Ljg1NmwxNi4xMi0xNi4xMTYNCgkJCWM1LjA2LTUuMDY0LDcuODUyLTExLjgyNCw3Ljg1Mi0xOS4wMjhjMC03LjIwNC0yLjc5Mi0xMy45Ni03Ljg1Mi0xOS4wMjhMMzAwLjE4OCwyNDZ6Ii8+DQoJPC9nPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=)}.MM-IconInfo{background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9IjMwLjA2M3B4IiBoZWlnaHQ9IjMwLjA2M3B4IiBmaWxsPSIjNTQ5NmNkIiB2aWV3Qm94PSIwIDAgMzAuMDYzIDMwLjA2MyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzAuMDYzIDMwLjA2MzsiDQoJIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPHBhdGggZD0iTTE3LjYyOSwyNi41ODRsMi4zOTEsMC4xMjd2My4zNTNoLTkuOTc3di0zLjE4N2wxLjM4NC0wLjEyNWMwLjc1NC0wLjA4NiwxLjIxNS0wLjMzNiwxLjIxNS0xLjM0MlYxMy43NTYNCgkJYzAtMC45MjYtMC4yNTItMS4yMTktMS4wNDktMS4yMTlsLTEuNDY2LTAuMDgyVjguOTc2aDcuNTAyVjI2LjU4NHogTTE0LjY5NiwwYzEuODQ1LDAsMy4xODcsMS4zODcsMy4xODcsMy4xNDYNCgkJYzAsMS43NjMtMS4zNDIsMy4wNjItMy4yMjksMy4wNjJjLTEuOTI3LDAtMy4xODctMS4zMDEtMy4xODctMy4wNjJDMTEuNDY3LDEuMzg2LDEyLjcyNywwLDE0LjY5NiwweiIvPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=)}";
    var _tagStyleModal = document.createElement('style');
    _tagStyleModal.type = 'text/css';
    //_tagStyleModal.innerHTML = _modalCss;
    _tagStyleModal.appendChild(document.createTextNode(_modalCss));
    document.getElementsByTagName("head")[0].appendChild(_tagStyleModal);
}
/**
 * Método utilizado para criar tag style contendo estilos usado pelo busy
 */
function createBusyStyle() {
    //DEFININDO CSS PARA BUSY INDICATOR
    var _MMBusy = ".MM-Busy{margin:0;padding:0;position:fixed;display:flex;justify-content:center;align-items:center;top:0;width:100%;max-width:1240px;height:100%;background-color:rgba(250,250,250,.7);z-index:1000}.MM-Busy div{width:1.5em;height:1.5em;display:block;text-indent:1px;-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;background:#00a4eb;z-index:100;border-radius:100%;box-shadow:inset 0 0 2px 1px rgba(66,124,172,.8);content:\"\"}.MM-Busy div:nth-child(1){-webkit-animation:MM-Busy 1.8s infinite 0s ease-in-out;animation:MM-Busy 1.8s infinite 0s ease-in-out;-webkit-animation-fill-mode:both;animation-fill-mode:both}.MM-Busy div:nth-child(2){-webkit-animation:MM-Busy 1.8s infinite .4s ease-in-out;animation:MM-Busy 1.8s infinite .4s ease-in-out;-webkit-animation-fill-mode:both;animation-fill-mode:both}.MM-Busy div:nth-child(3){-webkit-animation:MM-Busy 1.8s infinite .8s ease-in-out;animation:MM-Busy 1.8s infinite .8s ease-in-out;-webkit-animation-fill-mode:both;animation-fill-mode:both}@keyframes MM-Busy{0%,100%,80%{transform:scale(.4);background-color:#00a4eb}40%{transform:scale(1);background-color:rgba(0,164,235,.1)}}";
    var _tagStyleBusy = document.createElement('style');
    _tagStyleBusy.type = 'text/css';
    //_tagStyleBusy.innerHTML = _MMBusy;
    _tagStyleBusy.appendChild(document.createTextNode(_MMBusy));
    document.getElementsByTagName("head")[0].appendChild(_tagStyleBusy);
}
