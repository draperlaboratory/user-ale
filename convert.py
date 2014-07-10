from jinja2 import Environment, FileSystemLoader

loader = FileSystemLoader('templates')

env = Environment(loader=loader)


def convert_file(fname):
	template = env.get_template(fname)

	a = template.render(active=fname)

	fid = open(fname, 'w')
	fid.write(a)
	fid.close()

convert_file('index.html')
convert_file('transform.html')
convert_file('define.html')
convert_file('explore.html')
convert_file('getdata.html')
convert_file('create.html')
convert_file('enrich.html')

convert_file('getting_started.html')
convert_file('documentation.html')

