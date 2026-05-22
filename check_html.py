from html.parser import HTMLParser

class MyParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        
    def handle_starttag(self, tag, attrs):
        if tag not in ['meta', 'link', 'br', 'hr', 'img', 'input', 'source']:
            self.stack.append((tag, self.getpos()))
            
    def handle_endtag(self, tag):
        if not self.stack:
            print(f'Unmatched end tag {tag} at {self.getpos()}')
            return
        last_tag, pos = self.stack.pop()
        if last_tag != tag:
            print(f'Mismatched end tag {tag} at {self.getpos()}. Expected {last_tag} from {pos}')

parser = MyParser()
with open('porta.html', 'r', encoding='utf-8') as f:
    parser.feed(f.read())

for tag, pos in parser.stack:
    print(f'Unclosed tag {tag} from {pos}')
