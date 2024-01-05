const fs = require('fs');
const path = require('path');
const brain = require('brain.js');
const { loadTextFiles } = require('../utils/read_files');

class RecruitmentTrainer {
  constructor() {
    const recruitmentFolderPath = path.join(__dirname, '..', 'data', 'recruitment');
    this.recruitmentTexts = loadTextFiles(recruitmentFolderPath);
    this.maxLength = 1000;
    this.tokenizer = new brain.recurrent.LSTM();
    this.sequencesRecruitment = this.preprocessTexts(this.recruitmentTexts);
    this.paddedSequencesRecruitment = this.padSequences(this.sequencesRecruitment);
    this.recruitmentLabels = Array(this.recruitmentTexts.length).fill('recruitment');
    this.numericLabelsRecruitment = this.recruitmentLabels.map(label => label === 'recruitment' ? 1 : 0);
    this.net = new brain.recurrent.LSTM();
  }

  preprocessTexts(texts) {
    return texts.map(sentence => sentence.split(' ')); // Tokenización básica por ahora
  }

  padSequences(sequences) {
    const maxLength = this.maxLength;
    return sequences.map(seq => {
      while (seq.length < maxLength) {
        seq.push(0); // Padding con ceros
      }
      return seq.slice(0, maxLength);
    });
  }

  train() {
    console.log('init train IA');
    this.net.train(this.paddedSequencesRecruitment, this.numericLabelsRecruitment, {
      iterations: 100,
      log: true,
      errorThresh: 0.005,
    });

    const trainedModel = this.net.toJSON();
    fs.writeFileSync('recruitment_trained_model.json', JSON.stringify(trainedModel));
    console.log('Training completed. Model saved as recruitment_trained_model.json');
  }
}

module.exports = RecruitmentTrainer;