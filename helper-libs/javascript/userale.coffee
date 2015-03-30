activities = [
  'add',
  'remove',
  'create',
  'delete',
  'select',
  'deselect',
  'enter',
  'leave',
  'inspect',
  'alter',
  'hide',
  'show'
]



console.log('in userale')

extend = (objects...) ->
  for object in objects
    for key, value of object
      objects[0][key] = value
  return objects[0]

getParameterByName = (name) ->
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]")
  regex = new RegExp("[\\?&]" + name + "=([^&#]*)")

  results = regex.exec(location.search)
  console.log(results)
  results = if results then decodeURIComponent(results[1].replace(/\+/g, " ")) else ""

defaults = {
  loggingUrl: ''
  toolName: 'UNK'
  toolVersion: 'UNK'
  workerUrl: 'userale-worker.js'
  debug: true
  sendLogs: true
  componentGroups: []
}

class userale
  constructor: (options)->

    @options = extend(defaults, options)

    if @options.component_groups.contructor is not Array
      @options.component_groups = [@options.component_groups]

    @options.version = '3.0.0'

    @worker = new Worker(@options.workerUrl)

  register: () ->
#    @toolName = toolName
#    @toolVersion = toolVersion
#    @component_groups = component_groups

    @sessionID = getParameterByName('USID')
    @client = getParameterByName('client')

    console.log(@sessionID)

    if !@sessionID
      @sessionID = @toolName[0..2].toUpperCase() + new Date().getTime()
      console.warn('USERALE: NO SESSION ID, MAKING ONE UP.  You can pass one in as url parameter (127.0.0.1?USID=12345)')

    if !@client
      @client = 'UNK'
      console.warn('USERALE: NO CLIENT, MAKING ONE UP.   You can pass one in as url parameter (127.0.0.1?client=roger)')

    @worker.postMessage({cmd: 'sendBuffer', msg: ''})

  log: (msg) ->
    for key, value of msg
      if key is 'component'
        if value.group in @options.component_groups
          console.log("#{ value.group } is in component groups")
        else
          console.warn("#{ value.group } is NOT in component groups")


window.userale = userale