from flask import Flask, render_template, jsonify, request, Response
from flask_sqlalchemy import SQLAlchemy

# flask app init
app = Flask(__name__)
# setting sqlite URI for todolist.db
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
# database module init
db = SQLAlchemy(app)

class Task(db.Model):
    __tablename__ = 'tasks'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(256), nullable=False)
    done = db.Column(db.Boolean, default=False)
    priority = db.Column(db.Integer, default=0)
    details = db.Column(db.String(1024))
    date = db.Column(db.DateTime, nullable=False)

    @staticmethod
    def new(title:str, details:str, done=False, priority=0):
        t = Task()
        t.title = title
        t.details = details
        t.done = done
        t.priority = priority
        db.session.add(t)
        db.session.commit()    

    def toDict(self)->dict:
        return {
            'id': self.id,
            'title': self.title,
            'done': self.done,
            'priority': self.priority,
            'details': self.details,
            'date': self.date
        }
    
    @app.route('/')
    def index():
        return render_template('index.html')
    
    @app.route('/get-tasks', methods=['GET'])
    def get_taks():
        tasks = Task.query.all()
        ret = []
        for t in tasks:
            ret.append(t.toDict())

        return jsonify(ret)
    
    @app.route('/add-task', methods=['POST'])
    def add_task():
        data = request.get_json()
        Task.new(data['title'], data['details'], data['done'], data['priority'])
        return Response(status=200)
    

    # run the app
    with app.app_context():
        db.create_all()