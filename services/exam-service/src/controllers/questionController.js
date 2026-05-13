exports.getQuestions = async (req, res) => {
  return res.status(501).json({
    success: false,
    message: 'Question API iskeleti hazır. Soru modeli ve örnek veri görevi Koray tarafından tamamlanacak.',
    examId: req.params.examId,
  });
};

exports.addQuestion = async (req, res) => {
  return res.status(501).json({
    success: false,
    message: 'Soru ekleme endpoint iskeleti hazır. Bu görev Koray/ilgili backend göreviyle tamamlanacak.',
  });
};

exports.updateQuestion = async (req, res) => {
  return res.status(501).json({
    success: false,
    message: 'Soru güncelleme endpoint iskeleti hazır.',
  });
};

exports.deleteQuestion = async (req, res) => {
  return res.status(501).json({
    success: false,
    message: 'Soru silme endpoint iskeleti hazır.',
  });
};