jQuery(function ($) {

    const LS_NAMESPACE = 'learnMath';

    var equationObject = {
        init: function () {
            this.mathOperation = 'addition';
            questionObject = LS_util.getLearnMathQuestion() || this.createQuestion(this.mathOperation);
            this.setQuestionObject(questionObject); // floods the equationObject
        },
        setQuestionObject: function (questionObject) {
            this.questionObject = questionObject;
        },
        getQuestionObject: function () {
            return this.questionObject;
        },
        createQuestion: function (mathOperation) {
            lowNum = this.generateRandomNumber();
            highNum = this.generateRandomNumber();
            mathOperation = this.mathOperation;
            questionObject = {
                lowNum: lowNum,
                highNum: highNum,
                mathOperation: mathOperation,
            };
            LS_util.setLearnMathQuestion(questionObject);
            this.setQuestionObject(questionObject);
            return questionObject;
        },
        generateRandomNumber: function () {
            return Math.floor(Math.random() * Math.pow(10, 1));
        },
        checkAnswer: function (answerInput) {
            questionObject = this.getQuestionObject();
            questionObject.userAnswer = answerInput;
            return questionObject;
        },
        getMathOperationSymbol: function (mathOperation) {
            var arithmatic = {
                addition: '+',
                subtraction: '-',
                multiplication: '*',
                division: '/',
            };
            return arithmatic[mathOperation];
        },
        setMathOperation: function (mathOperation) {
            this.mathOperation = mathOperation;
        },
    };

    var arithmatic = {
        addition: function (a, b) {
            return a + b;
        },
        subtraction: function (a, b) {
            return a - b;
        },
        multiplication: function (a, b) {
            return a * b;
        },
        division: function (a, b) {
            return a / b;
        }
    };


    var LS_util = {
        setLearnMathObjectToLS: function (data) {
            localStorage.setItem(LS_NAMESPACE, JSON.stringify(data));
        },
        getLearnMathObjectFromLS: function () {
            return JSON.parse(localStorage.getItem(LS_NAMESPACE));
        },
        getLearnMathQuestion: function () {
            return this.getLearnMathObjectFromLS() ? this.getLearnMathObjectFromLS().question : null;
        },
        setLearnMathQuestion: function (questionObject) {
            var localObject = {};
            localObject.question = questionObject;
            this.setLearnMathObjectToLS(localObject);
        },
    };

    var view = {
        displayQuestion: function (questionObject) {
            symbol = equationObject.getMathOperationSymbol(questionObject.mathOperation);
            console.log(`Question: ${questionObject.lowNum} ${symbol} ${questionObject.highNum} = `);
        },
        displayHistory: function (historyObject) {
            i = historyObject.length;
            while (i--) {
                var symbol = equationObject.getMathOperationSymbol(historyObject[i].mathOperation);
                var mathOperation = historyObject[i].mathOperation;
                correctAnswer = arithmatic[mathOperation](historyObject[i].lowNum, historyObject[i].highNum);
                var isCorrect = (correctAnswer === historyObject[i].userAnswer) ? 'Correct' : 'Incorrect';
                console.log(`${i}: ${isCorrect} - ${historyObject[i].lowNum} ${symbol} ${historyObject[i].highNum} = ${correctAnswer} ... You answered: ${historyObject[i].userAnswer}`);
            }
        },
        displayResponse: function (questionObject) {
            symbol = equationObject.getMathOperationSymbol(questionObject.mathOperation);
            correctAnswer = arithmatic[questionObject.mathOperation](questionObject.lowNum, questionObject.highNum);
            if (correctAnswer === questionObject.userAnswer) {
                console.log(`Correct: ${questionObject.lowNum} ${symbol} ${questionObject.highNum} = ${correctAnswer}`);
            } else {
                console.log(`Incorrect: ${questionObject.lowNum} ${symbol} ${questionObject.highNum} = ${correctAnswer}. You put ${questionObject.userAnswer}`);
            }
        },
    };

    var h = handler = {
        question: function () {
            var questionObject = equationObject.getQuestionObject();
            view.displayQuestion(questionObject);
        },
        answer: function (answerInput) {
            var questionObject = equationObject.checkAnswer(answerInput);
            view.displayResponse(questionObject);
            this.nextQuestion();
        },
        nextQuestion: function () {
            var questionObject = equationObject.createQuestion();
            view.displayQuestion(questionObject);
        },
        changeMathOperation: function (mathOperation) {
            equationObject.setMathOperation(mathOperation);
            this.nextQuestion();
        },
        clearLearnMath: function () {
            localStorage.clear();
            console.log('History cleared...');
        },
    }

    var App = {
        init: function () {
            equationObject.init();
            handler.question();
        },
    };

    App.init();

});