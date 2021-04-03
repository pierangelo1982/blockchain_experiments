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
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        App.account = accounts[0];
        console.log("Accounts", accounts);
        console.log("Account", App.account);
    },

    loadContract: async () => {
        const todoList = await $.getJSON('TodoList.json');
        console.log(todoList);
        App.contracts.TodoList = TruffleContract(todoList);
        App.contracts.TodoList.setProvider(App.provider);
        console.log("todoList:", todoList);

        // Hydrate the smart contract with values from the blockchain
        App.todoList = await App.contracts.TodoList.deployed()
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
      await App.renderTasks()
      // Update loading state
      App.setLoading(false)
    },

    renderTasks: async () => {
        // load total task count from the blockchain
        const taskCount = await App.todoList.taskCount();
        const $taskTemplate = $('.taskTemplate');

        // render out each task with a new task template
        for (var i = 1; i <= taskCount; i++) {
            const task = await App.todoList.tasks(i);
            const taskId = task[0].toNumber();
            const taskContent = task[1];
            const taskCompleted = task[2];

            const $newTaskTemplate = $taskTemplate.clone()
            $newTaskTemplate.find('.content').html(taskContent);
            $newTaskTemplate.find('input')
                            .prop('name', taskId)
                            .prop('checked', taskCompleted)
                            .on('click', App.toggleCompleted);

            // put the task in the correct list
            if (taskCompleted) {
                $('#completedTaskList').append($newTaskTemplate);
            } else {
                $('#taskList').append($newTaskTemplate);
            }
            // show the task
            $newTaskTemplate.show();
        }
    },

    createTask: async () => {
        App.setLoading(true)
        const content = $('#newTask').val()
        await App.todoList.createTask(content)
        window.location.reload()
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