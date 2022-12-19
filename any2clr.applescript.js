ObjC.import('AppKit')

var app = Application.currentApplication()
app.includeStandardAdditions = true

var input = app.chooseFile({ ofType: ["txt", "json"] })
var name = input.toString().match(/.+\/([^.]+)/)[1]
var output = app.chooseFileName({ defaultName: name + '.clr' })
var contents = app.read(input)
var nsclrlist = $.NSColorList.alloc.initWithName(name)
var colors = []

if (contents[0] == "{") {
	colors = JSON.parse(contents)
	colors = Object.keys(colors).map(s => ({ name: s, color: colors[s] }))
} else {
	colors = contents.split("\n")
	colors = colors.map(line => line.match(/(\S+)\s+(.+)/))
	colors = colors.filter(match => match)
	colors = colors.map(match => ({ name: match[2], color: match[1] }))
}
colors.forEach(o => {
	if (o.color.startsWith("#"))
		o.color = o.color.substring(1)
	if (o.color.length < 6)
		o.color = o.color.split('').reduce((str, hex) => str + hex + hex, '')
	o.color += 'ff'
	; [o.r, o.g, o.b, o.a] = o.color.match(/../g).map(hex => parseInt(hex, 16) / 255)
})

colors.forEach((o, i) => o.nscolor = $.NSColor.colorWithCalibratedRedGreenBlueAlpha(o.r, o.g, o.b, o.a))
colors.forEach((o, i) => nsclrlist.insertColorKeyAtIndex(o.nscolor, o.name, i))
nsclrlist.writeToFile(output.toString())
