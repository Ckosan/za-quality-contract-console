const goInit = (go, myDiagramDiv, myPaletteDiv, options) => {
  var $ = go.GraphObject.make
  var $$ = jQuery
  // 记录canvas dom
  var part = null
  var myDiagram = $(go.Diagram, myDiagramDiv, {
    // initialContentAlignment: go.Spot.Center,
    // initialAutoScale: go.Diagram.Uniform,
    // contentAlignment: go.Spot.Center, //对齐方式
    // 画布里的元素布局方式
    // layout: $(go.ForceDirectedLayout, { defaultSpringLength: 30, defaultElectricalCharge: 100 }),

    // TreeLayout默认是从左向右排列，我们需要把设置为从上到下的形式,将角度值设置为90.
    // layout: $(go.TreeLayout, { angle: 90 }),
    layout: $(go.LayeredDigraphLayout, { isInitial: false, direction: 90, columnSpacing: 50, isOngoing: false, layerSpacing: 50 }),
    // layout: $(go.TreeLayout, { angle: 90, layerSpacing: 35, alignment: go.TreeLayout.AlignmentBusBranching, nodeSpacing: 100 }),
    // layout: $(go.LayeredDigraphLayout, { direction: 90, columnSpacing: 240 }),
    grid: $(
      go.Panel,
      'Grid',
      $(go.Shape, 'LineH', { stroke: 'lightgray', strokeWidth: 0.5 }),
      $(go.Shape, 'LineH', { stroke: 'gray', strokeWidth: 0.5, interval: 10 }),
      $(go.Shape, 'LineV', { stroke: 'lightgray', strokeWidth: 0.5 }),
      $(go.Shape, 'LineV', { stroke: 'gray', strokeWidth: 0.5, interval: 10 })
    ),
    allowDrop: true,
    'draggingTool.dragsLink': true,
    'draggingTool.isGridSnapEnabled': true,
    'linkingTool.isUnconnectedLinkValid': true,
    'linkingTool.portGravity': 20,
    'relinkingTool.isUnconnectedLinkValid': true,
    'relinkingTool.portGravity': 20,
    'relinkingTool.fromHandleArchetype': $(go.Shape, 'Diamond', {
      segmentIndex: 0,
      cursor: 'pointer',
      desiredSize: new go.Size(8, 8),
      fill: 'tomato',
      stroke: 'darkred'
    }),
    'relinkingTool.toHandleArchetype': $(go.Shape, 'Diamond', {
      segmentIndex: -1,
      cursor: 'pointer',
      desiredSize: new go.Size(8, 8),
      fill: 'darkred',
      stroke: 'tomato'
    }),
    'linkReshapingTool.handleArchetype': $(go.Shape, 'Diamond', {
      desiredSize: new go.Size(7, 7),
      fill: 'lightblue',
      stroke: 'deepskyblue'
    }),
    'undoManager.isEnabled': true // 打开 Ctrl-Z 和 Ctrl-Y 撤销重做功能
  })

  // GoJS涵盖了三种基本事件：DiagramEvents（图表事件）、InputEvents（输入事件）以及ChangedEvents（变更事件）。
  // DiagramEvent（图表事件）表示一般用户发起的对图表的改变。你可以通过调用Diagram.addDiagramListener注册图表事件处理程序。各个图表事件以名字区分
  // 监听新拖到画布的节点
  myDiagram.addModelChangedListener(function(evt) {
    // 忽略未完成的事务
    if (!evt.isTransactionFinished) return
    var txn = evt.object // a Transaction
    if (txn === null) return

    // 迭代事务的所有实际ChangedEvents
    txn.changes.each(function(e) {
      // 除了添加/删除节点之外，忽略任何类型的更改
      if (e.modelChange !== 'nodeDataArray') return
      // 必须以start节点开始,而且只能有一个start节点
      if ((myDiagram.model.nodeDataArray.length > 1 && e.newValue && e.newValue.type === 'start') || (myDiagram.model.nodeDataArray.length === 1 && e.newValue && e.newValue.type !== 'start')) {
        setTimeout(() => {
          // 移除添加的节点
          myDiagram.model.removeNodeData(e.newValue)
          options.hideStepInfo()
        }, 300)
      }
    })
  })
  // 点击画布背景
  myDiagram.addDiagramListener('BackgroundSingleClicked', function(e) {
    options.clickBackground(e)
  })

  // 连线完成
  myDiagram.addDiagramListener('LinkDrawn', function(e) {
    options.linkDrawn(e.subject.data)
  })

  // 监听节点删除事件
  // myDiagram.addDiagramListener("SelectionDeleted", function(e) {
  //   e.subject.each(function(n) {
  //     console.log(n.data.key);
  //   });
  // });

  function makePort(name, spot, output, input) {
    return $(go.Shape, 'Circle', {
      fill: null,
      stroke: null,
      desiredSize: new go.Size(7, 7),
      alignment: spot,
      alignmentFocus: spot,
      portId: name,
      fromSpot: spot,
      toSpot: spot,
      fromLinkable: output,
      toLinkable: input,
      cursor: 'pointer'
    })
  }

  var nodeSelectionAdornmentTemplate = $(go.Adornment, 'Auto', $(go.Shape, { fill: null, stroke: 'deepskyblue', strokeWidth: 1.5, strokeDashArray: [4, 2] }), $(go.Placeholder))
  var nodeResizeAdornmentTemplate = $(
    go.Adornment,
    'Spot',
    { locationSpot: go.Spot.Right },
    $(go.Placeholder),
    $(go.Shape, {
      alignment: go.Spot.TopLeft,
      cursor: 'nw-resize',
      desiredSize: new go.Size(6, 6),
      fill: 'lightblue',
      stroke: 'deepskyblue'
    }),
    $(go.Shape, {
      alignment: go.Spot.Top,
      cursor: 'n-resize',
      desiredSize: new go.Size(6, 6),
      fill: 'lightblue',
      stroke: 'deepskyblue'
    }),
    $(go.Shape, {
      alignment: go.Spot.TopRight,
      cursor: 'ne-resize',
      desiredSize: new go.Size(6, 6),
      fill: 'lightblue',
      stroke: 'deepskyblue'
    }),
    $(go.Shape, {
      alignment: go.Spot.Left,
      cursor: 'w-resize',
      desiredSize: new go.Size(6, 6),
      fill: 'lightblue',
      stroke: 'deepskyblue'
    }),
    $(go.Shape, {
      alignment: go.Spot.Right,
      cursor: 'e-resize',
      desiredSize: new go.Size(6, 6),
      fill: 'lightblue',
      stroke: 'deepskyblue'
    }),
    $(go.Shape, {
      alignment: go.Spot.BottomLeft,
      cursor: 'se-resize',
      desiredSize: new go.Size(6, 6),
      fill: 'lightblue',
      stroke: 'deepskyblue'
    }),
    $(go.Shape, {
      alignment: go.Spot.Bottom,
      cursor: 's-resize',
      desiredSize: new go.Size(6, 6),
      fill: 'lightblue',
      stroke: 'deepskyblue'
    }),
    $(go.Shape, {
      alignment: go.Spot.BottomRight,
      cursor: 'sw-resize',
      desiredSize: new go.Size(6, 6),
      fill: 'lightblue',
      stroke: 'deepskyblue'
    })
  )

  myDiagram.nodeTemplate = $(
    go.Node,
    'Spot',
    { locationSpot: go.Spot.Center },
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
    { selectable: true, selectionAdornmentTemplate: nodeSelectionAdornmentTemplate },
    { resizable: true, resizeObjectName: 'PANEL', resizeAdornmentTemplate: nodeResizeAdornmentTemplate },
    new go.Binding('angle').makeTwoWay(),
    new go.Binding('isActionable', 'isActionable'),
    $(
      go.Panel,
      'Auto',
      { name: 'PANEL' },
      new go.Binding('desiredSize', 'size', go.Size.parse).makeTwoWay(go.Size.stringify),
      $(
        go.Shape,
        'Rectangle',
        {
          portId: '',
          fromLinkable: true,
          toLinkable: true,
          cursor: 'pointer',
          fill: 'white',
          strokeWidth: 1
        },
        new go.Binding('figure'),
        new go.Binding('fill')
      ),
      $(
        go.TextBlock,
        {
          font: 'bold 11pt Helvetica, Arial, sans-serif',
          margin: 8,
          maxSize: new go.Size(300, NaN),
          wrap: go.TextBlock.WrapFit,
          editable: true,
          textEdited: function(textBlock, previousText, currentText) {
            console.log(currentText)
            options.changeNodeSelection(textBlock.part.data)
          }
        },

        new go.Binding('text').makeTwoWay()
      )
    ),
    makePort('T', go.Spot.Top, false, true),
    makePort('L', go.Spot.Left, true, true),
    makePort('R', go.Spot.Right, true, true),
    makePort('B', go.Spot.Bottom, true, false),

    // 类似的点击事件属性包括 GraphObject.click, GraphObject.doubleClick, 和 GraphObject.contextClick。
    // 类似的鼠标移入事件属性包括GraphObject.mouseEnter, GraphObject.mouseOver和GraphObject.mouseLeave。
    // 类似的鼠标悬停事件属性包括 GraphObject.mouseHover和GraphObject.mouseHold。.
    // 拖拽操作也有对应的事件属性：GraphObject.mouseDragEnter, GraphObject.mouseDragLeave, 和GraphObject.mouseDrop. 他们适用于静止的对象，而不是被拖动中的对象。

    {
      mouseEnter: function(e, node) {
        if (!node.data.isActionable) showSmallPorts(node, true)
      },
      mouseLeave: function(e, node) {
        showSmallPorts(node, false)
      },
      click: function(e, node) {
        options.clickNode(node)
        // 排版功能
        if (!node.data.isActionable) return
        myDiagram.layout = $(go.TreeLayout, { angle: 90 })
        // myDiagram.layout = $(go.LayeredDigraphLayout, { isInitial: false, direction: 90, columnSpacing: 50, isOngoing: false, layerSpacing: 50 });
        // setTimeout(() => {
        //   myDiagram.layout = $(go.Layout);
        // }, 1000);
      },
      doubleClick: function(e, node) {
        // console.log(e,'dbclick');
        // console.log(node,'dbclick')
        options.doubleClickNode(node)
        // console.log(myDiagram.model.toJson());
      },
      contextClick: function(e, node) {
        console.log('contextClick', node)
        // options.doubleClickNode(node);
      },
      selectionChanged: function(eventPart) {
        if (!part) {
          part = eventPart
        } else if (part.__gohashid === eventPart.__gohashid) {
          return
        } else {
          part = eventPart
        }
        var dom = $$('.my-diagram-div canvas')
        dom.unbind('click', myFunction).bind('click', myFunction)
        function myFunction(e) {
          const position = {
            x: e.clientX,
            y: e.clientY
          }
          options.changeNodeSelection(eventPart.data, position)
          dom.unbind('click', myFunction)
        }
      }
    },
    {
      toolTip: $(
        go.Adornment,
        'Auto',
        $(
          go.Shape,
          { fill: '#FFFFCC' },
          new go.Binding('visible', 'info', function(i) {
            return !!i
          })
        ),
        $(go.TextBlock, { margin: 4 }, new go.Binding('text', 'info'))
      )
    }
  )

  function showSmallPorts(node, show) {
    node.ports.each(function(port) {
      if (port.portId !== '') {
        port.fill = show ? 'rgba(0,0,0,.3)' : null
      }
    })
  }

  // 选中的 link 线
  var linkSelectionAdornmentTemplate = $(go.Adornment, 'Link', $(go.Shape, { isPanelMain: true, fill: null, stroke: 'red', strokeWidth: 0 }))

  myDiagram.linkTemplate = $(
    go.Link,
    { selectable: true, selectionAdornmentTemplate: linkSelectionAdornmentTemplate },
    { relinkableFrom: true, relinkableTo: true, reshapable: true },
    {
      routing: go.Link.AvoidsNodes,
      curve: go.Link.JumpOver,
      corner: 5,
      toShortLength: 4
    },
    new go.Binding('points').makeTwoWay(),
    $(go.Shape, { isPanelMain: true, strokeWidth: 2 }),
    $(go.Shape, { toArrow: 'Standard', stroke: null }),
    $(
      go.Panel,
      'Auto',
      $(
        go.Shape,
        'RoundedRectangle',
        new go.Binding('fill', 'text', function(v) {
          return v ? '#F8F8F8' : null
        }),
        { stroke: null, fill: null }
      ),
      $(
        go.TextBlock,
        {
          segmentIndex: 1,
          segmentFraction: 0.5,
          textAlign: 'center',
          font: '10pt helvetica, arial, sans-serif',
          stroke: 'red',
          margin: 2,
          minSize: new go.Size(10, NaN),
          editable: true
        },
        new go.Binding('text').makeTwoWay()
      )
    )
  )

  // Rectangle（矩形）、RoundedRectangle（圆角矩形），Ellipse（椭圆形），Triangle（三角形），Diamond（菱形），Circle（圆形）

  var tplNode = [
    { text: 'Start', figure: 'Ellipse', fill: '#00AD5F', info: '', type: 'start' },
    { text: 'Handler', info: '', type: 'handler' },
    { text: 'IfHandler', figure: 'RoundedRectangle', fill: 'burlywood', type: 'ifHandler' },
    { text: 'Branch', figure: 'RoundedRectangle', fill: 'lightyellow', info: '', type: 'branch' },
    { text: 'If', figure: 'Diamond', fill: 'lightskyblue', info: '', type: 'if' },
    // { text: "Terminate", figure: "Ellipse", fill: "aliceblue", info: "", type: "terminate" },
    { text: 'End', figure: 'Ellipse', fill: '#CE0620', info: '', type: 'end' }
  ]

  if (options.isSort) tplNode.push({ text: '排版', figure: 'RoundedRectangle', isActionable: true })
  $(go.Palette, myPaletteDiv, {
    maxSelectionCount: 1,

    nodeTemplateMap: myDiagram.nodeTemplateMap,
    linkTemplate: $(
      go.Link,
      {
        locationSpot: go.Spot.Center,
        selectionAdornmentTemplate: $(go.Adornment, 'Link', { locationSpot: go.Spot.Center }, $(go.Shape, { isPanelMain: true, fill: null, stroke: 'deepskyblue', strokeWidth: 0 }), $(go.Shape, { toArrow: 'Standard', stroke: null }))
      },
      {
        routing: go.Link.AvoidsNodes,
        curve: go.Link.JumpOver,
        corner: 5,
        toShortLength: 4
      },
      new go.Binding('points'),
      $(go.Shape, { isPanelMain: true, strokeWidth: 2 }),
      $(go.Shape, { toArrow: 'Standard', stroke: null })
    ),
    model: new go.GraphLinksModel(
      tplNode
      // [
      //   {points: new go.List(go.Point).addAll([new go.Point(0, 0), new go.Point(30, 0), new go.Point(30, 40), new go.Point(60, 40)])}
      // ]
    )
  })
  return myDiagram
}

export default goInit
