ACTIVITIES = [
  'ADD',
  'REMOVE',
  'CREATE',
  'DELETE',
  'SELECT',
  'DESELECT',
  'ENTER',
  'LEAVE',
  'INSPECT',
  'ALTER',
  'HIDE',
  'SHOW',
  'OPEN',
  'CLOSE'
  'PERFORM'
]

ELEMENTS = [
  'BUTTON'
  'CANVAS'
  'CHECKBOX'
  'COMBOBOX'
  'DATAGRID'
  'DIALOG_BOX'
  'DROPDOWNLIST'
  'FRAME'
  'ICON'
  'INFOBAR'
  'LABEL'
  'LINK'
  'LISTBOX'
  'LISTITEM'
  'MAP'
  'MENU'
  'MODALWINDOW'
  'PALETTEWINDOW'
  'PANEL'
  'PROGRESSBAR'
  'RADIOBUTTON'
  'SLIDER'
  'SPINNER'
  'STATUSBAR'
  'TAB'
  'TABLE'
  'TAG'
  'TEXTBOX'
  'THROBBER'
  'TOAST'
  'TOOLBAR'
  'TOOLTIP'
  'TREEVIEW'
  'WINDOW'
  'WORKSPACE'
# Other is used in conjunction with softwareMetadata in order
# to provide a component in which is not currently listed within
# the COMPONENT list.
  'OTHER'
]


console.log('in userale')

extend = (objects...) ->
  out = {}
  for object in objects
    for key, value of object
      out[key] = value
  return out

getParameterByName = (name) ->
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]")
  regex = new RegExp("[\\?&]" + name + "=([^&#]*)")

  results = regex.exec(location.search)
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

default_msg = {
  activity: null,
  action: null,
  component: {
    id: null,
    type: null,
    group: null
  },
  source: null,
  object: null,
  tags: []
  meta: {}
}

class userale
  constructor: (options)->
    @options = extend(defaults, options)

    if @options.componentGroups.constructor is not Array
      @options.componentGroups = [@options.componentGroups]

    @options.version = '3.0.0'

    @worker = new Worker(@options.workerUrl)

    @worker.postMessage({
      cmd: 'setLoggingUrl',
      msg: @options.loggingUrl
    });

    @debug(@options.debug)
    @sendLogs(@options.sendLogs)

  register: () ->
    @options.sessionID = getParameterByName('USID')
    @options.client = getParameterByName('client')

    console.log(@options.sessionID)

    if !@options.sessionID
      @options.sessionID = @options.toolName[0..2].toUpperCase() + new Date().getTime()
      console.warn('USERALE: NO SESSION ID, MAKING ONE UP.  You can pass one in as url parameter (127.0.0.1?USID=12345)')

    if !@options.client
      @options.client = 'UNK'
      console.warn('USERALE: NO CLIENT, MAKING ONE UP.   You can pass one in as url parameter (127.0.0.1?client=roger)')

    @worker.postMessage({cmd: 'sendBuffer', msg: ''})

  log: (msg) ->
    for key, value of msg
      msg = extend(default_msg, msg)
      if key is 'component'
        if value.group not in @options.componentGroups
          console.warn("#{ value.group } is NOT in component groups")

        elementType = value.type.toUpperCase()
        if elementType not in ELEMENTS
          console.warn("USERALE: Unrecognized element - #{ elementType }")
        else if (elementType is 'OTHER') and !msg.meta.element?
          console.warn("USERALE: Element type set to 'other', but 'element' not set in meta object ")

        msg.component.type = elementType

      if key is 'activity'
        activities = (x.toUpperCase() for x in value.split('_'))
        for activity in activities
          if activity not in ACTIVITIES
            console.warn("USERALE: Unrecognized activity - #{ activity }")

        msg[key] = activities

      if key is 'source'
        value = value.toUpperCase()
        if value not in ['USER', 'SYSTEM', 'UNK']
          console.warn("USERALE: Unrecognized source - #{ value }")
          msg[key] = null
        else
          msg[key] = value.toUpperCase()

    msg.timestamp = new Date().toJSON()
    msg.client = @options.client
    msg.toolName = @options.toolName
    msg.toolVersion = @options.toolVersion
    msg.sessionID = @options.sessionID
    msg.language = 'JavaScript'
    msg.useraleVersion = @version

    @.worker.postMessage({
      cmd: 'sendMsg',
      msg: msg
    })

  debug: (onOff) ->
    @options.debug = onOff
    @worker.postMessage({
      cmd: 'setEcho',
      msg: onOff
    });

  sendLogs: (onOff) ->
    @options.sendLogs = onOff
    @worker.postMessage({
      cmd: 'setTesting',
      msg: !onOff
    });
#    console.log(msg)


window.userale = userale