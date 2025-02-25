from flask import Flask, render_template, jsonify, request, Response
from flask_sqlalchemy import SQLAlchemy
import enum
from datetime import date, datetime

# flask app init
app = Flask(__name__)
# setting sqlite URI for todolist.db
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
# database module init
db = SQLAlchemy(app)

class PriorityEnum(enum.Enum):
    low = 'l'
    medium = 'm'
    high = 'h'

class Task(db.Model):
    __tablename__ = 'tasks'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(256), nullable=False)
    done = db.Column(db.Boolean, default=False)
    priority = db.Column(db.Enum(PriorityEnum), default=PriorityEnum.low)
    description = db.Column(db.String(1024))
    date = db.Column(db.Date, nullable=False)

    @staticmethod
    def new(title: str, description: str, priority='l', done=False, date_str=None):
        # Converter a string da prioridade para um membro do Enum
        priority_enum = PriorityEnum(priority) if isinstance(priority, str) else priority
        # Converter a string da data para um objeto date
        date_obj = datetime.strptime(date_str, '%Y-%m-%d').date() if isinstance(date_str, str) else date_str

        t = Task(title=title, description=description, priority=priority_enum, done=done, date=date_obj)
        db.session.add(t)
        db.session.commit()

    def toDict(self) -> dict:
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'priority': self.priority.value,  # Converter Enum para string
            'done': self.done,
            'date': self.date.strftime('%Y-%m-%d')
        }

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get-tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    ret = [t.toDict() for t in tasks]
    return jsonify(ret)

@app.route('/add-task', methods=['POST'])
def add_task():
    data = request.get_json()

    # Criar a nova tarefa
    Task.new(data['title'], data['description'], data['priority'], data['done'], data['date'])

    return Response(status=200, response='Task adicionada com sucesso')

@app.route('/delete-task/<id>', methods=['DELETE'])
def delete_task(id:int):
    task = Task.query.filter_by(id=id).first()

    if task is None:
        return Response(status=404)
    
    db.session.delete(task)
    db.session.commit()
    return Response(status=200)

# initializes the sqlite db, if not initialized yet.
with app.app_context():
    db.create_all()
