

npm install -g truffle

truffle init

create a package.json file


truffle compile

crea migrazione copia file come da tutorial

truffle migrate

verifica
truffle console


```
todoList = await TodoList.deployed()

truffle(development)> todoList.address
'0x19fec0e440d78261F1426d189B8EF56CF514b66F'

truffle(development)> todoList.taskCount()
BN { negative: 0, words: [ 0, <1 empty item> ], length: 1, red: null }
truffle(development)> taskCount = await todoList.taskCount()
undefined
truffle(development)> taskCount
BN { negative: 0, words: [ 0, <1 empty item> ], length: 1, red: null }
truffle(development)> taskCount.toNumber
[Function: toNumber]
truffle(development)> taskCount.toNumber()
0
truffle(development)> 

```

