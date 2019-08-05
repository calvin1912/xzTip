# jQuery xzTip Plugin

xzTip 依赖于 jQuery，提供鼠标悬停提示或点击弹窗的功能，可以指定吸附于某个控件周围。提示内容可以手动配置，也可以从某个控件获取，允许以文本或图片的形式展示。

## 引用
将 dist 目录中解压至你的 Web 项目中，然后在 head 中引用样式：
```html
<link href="目录/dist/jquery.xzTip.css" rel="stylesheet">
```
在 body 结尾引用脚本：
```html
<script src="jquery.min.js"></script>
<script src="目录/dist/jquery.xzTip.js"></script>
```
当需要为某个 input 绑定提示时，在合适的位置插入如下代码：
```html
$('#demo').xzTip();
```

## 自定义参数
```html
$('#demo').xzTip({
    header      : '标题',
    open        : 'click',
    showOpenBtn : true,
    close	: 'none',
    showCloseBtn: true,
    escClose	: true,
    width	: 600,
    height	: 300,
    style	: 'window',
    overlay	: true
  });
```

## 示例
<a href="https://calvin1912.github.io/xzTip/example.html" target="_blank">点击这里查看所有演示</a>

## 版本更新日志
<a href="https://calvin1912.github.io/xzTip/logs.html" target="_blank">点击这里查看版本更新日志</a>

## 使用文档
### 选项参数
在初始化 xzTip 时，直接传递 json 格式的参数即可实现定制的弹出层或弹出窗口，具体参数如下：
<table class="table table-bordered table-striped">
  <thead>
    <tr>
      <th></th>
      <th>参数</th>
      <th>值类型</th>
      <th>必填</th>
      <th>默认值</th>
      <th>描述</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>header</td>
      <td>boolean<br/>string</td>
      <td>可选</td>
      <td>false</td>
      <td>是否显示标题，false：不显示，string：标题名称</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>open</td>
      <td>string</td>
      <td>可选</td>
      <td>mouseIn</td>
      <td>提示窗口打开的触发方式<br/>mouseIn：鼠标移入，click：鼠标点击，none：不定义</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>showOpenBtn</td>
      <td>boolean</td>
      <td>可选</td>
      <td>false</td>
      <td>是否显示打开按钮，默认为 false 表示不显示</td>
    </tr>
    <tr>
      <th scope="row">4</th>
      <td>close</td>
      <td>string</td>
      <td>可选</td>
      <td>mouseOut</td>
      <td>提示窗口关闭的触发方式<br/>mouseOut：鼠标移出，none：不定义</td>
    </tr>
    <tr>
      <th scope="row">5</th>
      <td>showCloseBtn</td>
      <td>boolean</td>
      <td>可选</td>
      <td>false</td>
      <td>是否显示关闭按钮，默认为 false 表示不显示</td>
    </tr>
    <tr>
      <th scope="row">6</th>
      <td>delayCloseTime</td>
      <td>integer</td>
      <td>可选</td>
      <td>500</td>
      <td>鼠标移出时延迟关闭的时间<br/>仅当 trigger 为 mouseOut 时有效</td>
    </tr>
    <tr>
      <th scope="row">7</th>
      <td>escClose</td>
      <td>boolean</td>
      <td>可选</td>
      <td>false</td>
      <td>是否监听 ESC 以关闭弹出层</td>
    </tr>
    <tr>
      <th scope="row">8</th>
      <td>data</td>
      <td>string</td>
      <td>可选</td>
      <td>null</td>
      <td>提示层显示的数据，默认 null 表示从控件中取值</td>
    </tr>
    <tr>
      <th scope="row">9</th>
      <td>dataType</td>
      <td>string</td>
      <td>可选</td>
      <td>text</td>
      <td>提示的数据类型<br/>image：显示图片，text：显示文本</td>
    </tr>
    <tr>
      <th scope="row">10</th>
      <td>width</td>
      <td>integer</td>
      <td>可选</td>
      <td>null</td>
      <td>提示窗口宽度，默认使用吸附控件的宽度</td>
    </tr>
    <tr>
      <th scope="row">11</th>
      <td>height</td>
      <td>integer</td>
      <td>可选</td>
      <td>null</td>
      <td>提示窗口高度，默认使用吸附控件的3倍高度</td>
    </tr>
    <tr>
      <th scope="row">12</th>
      <td>style</td>
      <td>string</td>
      <td>可选</td>
      <td>adsorption</td>
      <td>显示样式，window：弹出窗口，adsorption：吸附层。<br/>注：1、窗口显示时，固定为浏览器居中显示；<br/>2、吸附显示时固定至指定控件的周围。</td>
    </tr>
    <tr>
      <th scope="row">13</th>
      <td>adsorptionTo</td>
      <td>jQuery、function</td>
      <td>可选</td>
      <td>null</td>
      <td>弹出层吸附到的对象，默认为绑定的控件<br/>jQuery 选择符、对象或返回吸附控件 function</td>
    </tr>
    <tr>
      <th scope="row">14</th>
      <td>adsorptionPos</td>
      <td>string</td>
      <td>可选</td>
      <td>LL|LU</td>
      <td>弹出层与吸附控件的相对位置<br/>注：1、左边参数代表吸附控件的位置；<br/>2、右边参数代表弹出层的位置；<br/>3、LU、LL、RU、RL分别代表左上、左下、右上、右下。</td>
    </tr>
    <tr>
      <th scope="row">15</th>
      <td>bodyCls</td>
      <td>string</td>
      <td>可选</td>
      <td>null</td>
      <td>弹出层 body 的 css 类名</td>
    </tr>
    <tr>
      <th scope="row">16</th>
      <td>overlay</td>
      <td>boolean</td>
      <td>可选</td>
      <td>true</td>
      <td>是否显示遮罩层，仅当 style 为 window 时有效</td>
    </tr>
  </tbody>
</table>

### 方法
在初始化 xzTip 后，通过调用合适的方法获取或修改弹出层的参数。
<table class="table table-bordered table-striped">
  <thead>
    <tr>
      <th></th>
      <th>方法</th>
      <th>类型</th>
      <th>描述</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>title</td>
      <td>get/set</td>
      <td>获取或设置弹出层标题<br/>仅当 style 为 window 且 header 为 true 时有效</td>
    </tr>
  </tbody>
</table>
