App = {
    loading: false,
    contracts: {},

    load: async () => {
        await App.loadWeb3();
        await App.loadAccount();
        await App.loadContract();
        await App.render();
    },

    loadWeb3: async () => {
        if (typeof window.ethereum !== 'undefined') {
            App.provider = window.ethereum;
            console.log('MetaMask is installed!');
        } else {
            console.log("Metamask doesn't work");
        }
        if (window.ethereum) {
            await ethereum.enable();
        } else {
            console.log("Install MetaMask!")
        }
    },

    loadAccount: async () => {
        App.account = await ethereum.request({ method: 'eth_requestAccounts' });
        console.log("Account", App.account);
    },

    loadContract: async () => {
        const todoList = await $.getJSON('TodoList.json');
        console.log(todoList);
        App.contracts.TodoList = TruffleContract(todoList);
        App.contracts.TodoList.setProvider(App.provider);
        console.log("todoList:", todoList);

        App.todoList = await App.contracts.deployed;
        console.log("todolist deployed", App.todoList);
    },

    render: async () => {
        // Prevent double render
    if (App.loading) {
        return
      }
      // Update app loading state
      App.setLoading(true)
      // Render Account
      $('#account').html(App.account)
      // Render Tasks
      //await App.renderTasks()
      // Update loading state
      App.setLoading(false)
    },

    setLoading: (boolean) => {
        App.loading = boolean
        const loader = $('#loader')
        const content = $('#content')
        if (boolean) {
          loader.show()
          content.hide()
        } else {
          loader.hide()
          content.show()
        }
    }
}

$(() => {
    $(window).load(() => {
        App.load()
    })
})