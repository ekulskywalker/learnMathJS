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
            localObject.history = this.getLearnMathHistory();
            localObject.question = questionObject;
            this.setLearnMathObjectToLS(localObject);
        },
        getLearnMathHistory: function() {
            return this.getLearnMathObjectFromLS() ? this.getLearnMathObjectFromLS().history : null;
        },
        addLearnMathHistory: function(historyObject) {
            var localObject = {};
            localObject.question = this.getLearnMathQuestion();
            localObject.history = historyObject;
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
    var viewHTML = {
        displayQuestion: function(questionObject) {
            symbol = equationObject.getMathOperationSymbol(questionObject.mathOperation);
            displayQuestionHTML = `Question: ${questionObject.lowNum} ${symbol} ${questionObject.highNum} = `;
            $("#displayQuestion").html(displayQuestionHTML);
        },
        displayResponse: function(questionObject) {
            symbol = equationObject.getMathOperationSymbol(questionObject.mathOperation);
            correctAnswer = arithmatic[questionObject.mathOperation](questionObject.lowNum,questionObject.highNum);
            if (correctAnswer === questionObject.userAnswer) {
                var displayResponseHTML = `Correct: ${questionObject.lowNum} ${symbol} ${questionObject.highNum} = ${correctAnswer}`;
            } else {
                var displayResponseHTML = `Incorrect: ${questionObject.lowNum} ${symbol} ${questionObject.highNum} = ${correctAnswer}. You put ${questionObject.userAnswer}`;
            }
            $("#response").html(displayResponseHTML);
        },
        displayHistory: function(historyObject) {
            $("#history").html('');
            i = historyObject.length;
            while(i--){
                var symbol = equationObject.getMathOperationSymbol(historyObject[i].mathOperation);
                var mathOperation = historyObject[i].mathOperation;
                correctAnswer = arithmatic[mathOperation](historyObject[i].lowNum,historyObject[i].highNum);
                var isCorrect = (correctAnswer === historyObject[i].userAnswer) ? 'Correct' : 'Incorrect';
                var oneQuestion = `${i}: ${isCorrect} - ${historyObject[i].lowNum} ${symbol} ${historyObject[i].highNum} = ${correctAnswer} ... You answered: ${historyObject[i].userAnswer}`;
                var oneItem = $('<li></li>').text(oneQuestion);
                $("#history").append(oneItem);
            }
        },
    };

    var h = handler = {
        question: function () {
            var questionObject = equationObject.getQuestionObject();
            view.displayQuestion(questionObject);
            viewHTML.displayQuestion(questionObject);
            this.history();
        },
        answer: function (answerInput) {
            var questionObject = equationObject.checkAnswer(answerInput);
            view.displayResponse(questionObject);
            viewHTML.displayResponse(questionObject);
            learnMathHistory.addQuestionToHistory(questionObject);
            this.nextQuestion();
        },
        nextQuestion: function () {
            var questionObject = equationObject.createQuestion();
            view.displayQuestion(questionObject);
            viewHTML.displayQuestion(questionObject);
            this.history();
        },
        changeMathOperation: function (mathOperation) {
            equationObject.setMathOperation(mathOperation);
            this.nextQuestion();
        },
        clearLearnMath: function () {
            localStorage.clear();
            console.log('History cleared...');
        },
        history: function() {
            var historyObject = learnMathHistory.getHistoryObject();
            view.displayHistory(historyObject);
            viewHTML.displayHistory(historyObject);
        },
    }

    var learnMathHistory = {
        init: function() {
            this.getHistoryObject();
        },
        addQuestionToHistory: function(questionObject) {
            historyObject = this.getHistoryObject();
            historyObject.push(questionObject);
            LS_util.addLearnMathHistory(historyObject);
        },
        getHistoryObject: function() {
            return LS_util.getLearnMathHistory() || [];
        },
    };

    var App = {
        init: function () {
            equationObject.init();
            handler.question();
            learnMathHistory.init();
            $("#answer").on("keyup", this.submitme.bind(this));
            $("#submit").click(function(){
                var userAnswer = parseInt($("#answer").val());
                handler.answer(userAnswer);
                $("#answer").val('').focus();
            });
        },
        submitme: function(e) {
            if (e.which === 13) {
                var userAnswer = parseInt($("#answer").val());
                handler.answer(userAnswer);
                $("#answer").val('').focus();
            }
        },
    };

    App.init();

});