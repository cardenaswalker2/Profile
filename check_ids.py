from html.parser import HTMLParser

class MyParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        
    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if name == 'id':
                if value in self.ids:
                    print(f'Duplicate ID found: {value} at {self.getpos()}')
                self.ids.add(value)

parser = MyParser()
with open('porta.html', 'r', encoding='utf-8') as f:
    parser.feed(f.read())
print("ID check complete.")
