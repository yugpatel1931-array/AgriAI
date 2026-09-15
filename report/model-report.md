# AgriSmart AI — Model Report (Core Task)

*One-page model report per Problem Statement 1, Section 7.3. All numbers on
this page are pulled directly from `backend/outputs/test_evaluation.json`,
`backend/outputs/model_selection.json`, and `backend/outputs/history_efficientnet_b0.json`
in this repo — nothing here is estimated.*

## Task
Crop-disease image classification: single-label classification of a leaf
photo into one of **29 crop–disease classes** (7 crops: Apple, Cherry, Corn
(maize), Grape, bell Pepper, Potato, Tomato — each with its disease
subtypes plus a "healthy" class).

## Dataset & split
- **Source:** PlantVillage (lab-condition leaf images, Kaggle), as
  specified for the training/validation side of the core task.
- **Split:** stratified **70% train / 15% val / 15% test**, produced
  in-house from the PlantVillage set (`VAL_FRACTION = TEST_FRACTION = 0.15`
  in `backend/src/config.py`).
- **Measured test-set size:** 9,968 images across the 29 classes (summed
  from `test_evaluation.json` per-class support).
- ⚠️ **This is our own internal PlantVillage split — not the organizers'
  field-condition held-out set.** Per Section 4.1 of the problem statement,
  the scored core metric is computed by organizers on a separate
  PlantDoc-style field set we have not trained or validated on. The numbers
  below describe how the model performs on lab images it has seen the
  distribution of; see **Limitations**.

## Model / approach
- **Architecture:** EfficientNet-B0 (torchvision, ImageNet-pretrained
  backbone), transfer learning with a replaced classifier head
  (`Dropout(0.30) → Linear(in_features, 29)`).
- **Chosen over:** ResNet50 and MobileNetV3-Large, which `train.py --compare`
  can also train back-to-back; EfficientNet-B0 won on validation macro-F1
  (`backend/outputs/model_selection.json`).
- **Key hyperparameters** (`backend/src/config.py`): image size 224px,
  LR 3e-4, weight decay 1e-4, label smoothing 0.05, 2-epoch warmup, batch
  size 64 (GPU) / 16 (CPU), early stopping with patience 7.
- **Training run:** stopped early at **epoch 34** (of a 40-epoch budget)
  on validation macro-F1 plateau; test-time inference uses a small
  original+horizontal-flip ensemble.

## Metric & result
On our internal PlantVillage test split (9,968 images, 29 classes):

| Metric | Value |
| --- | --- |
| Test accuracy | 99.97% (0.999699) |
| **Test macro-F1** | **99.97% (0.999703)** |
| Test weighted-F1 | 99.97% (0.999699) |
| Best validation macro-F1 (training) | 99.96% (0.999590) |

**Confusion matrix:** see `confusion_matrix.png` in this folder (generated
by `backend/src/evaluate.py`). The entire 9,968-image test set produced
only **3 misclassified images**, all near-duplicate disease pairs:
1. 1× Corn *Cercospora/Gray leaf spot* → predicted Corn *Northern Leaf Blight*
2. 1× Pepper bell *healthy* → predicted Pepper bell *Bacterial spot*
3. 1× Tomato *Late blight* → predicted Tomato *Early blight*

Full per-class precision/recall/F1/support for all 29 classes is in
`backend/outputs/test_evaluation.json` (`per_class` array).

## Baseline
The organizer-provided baseline macro-F1 number (Section 9 scoring bands
are anchored to it) had not been published as of this report's writing —
**ships with the kickoff data**. This section will be filled in with the
actual comparison once that number is available; do not submit without it.

## Limitations
- **Lab-to-field gap (the intended core difficulty):** this model has
  only ever seen PlantVillage's clean, uniform-background lab photos. The
  99.97% test score reflects that distribution, not real-world field
  conditions (natural lighting, clutter, occlusion, multiple leaves,
  motion blur) that the organizers' actual held-out set uses. A
  significant score drop on the real evaluation is expected and is the
  scenario the problem statement explicitly designs for — **this number
  should not be presented as the expected competition score.**
- We have not yet run this model against any PlantDoc-style field images
  to get a realistic estimate of field-condition macro-F1. This is the
  single highest-priority item before submission (see repo README/TODO).
- **Class coverage:** the model's 29 classes are the full PlantVillage
  label set, not yet reconciled against the organizers' official
  ~15–20-class shared list (published at kickoff). Some trained classes
  (e.g. Cherry, some Grape/Corn subtypes) may fall outside the official
  shared list and could be a source of held-out-set errors if the model
  predicts an out-of-scope class. The exact label-string format expected
  by the organizers' `predict(image_path)` interface also has not yet
  been confirmed against ours (`Crop___Disease` with underscores).
- Near-perfect per-class scores (many at 1.00 precision/recall) on a
  held-out split from the *same* distribution as training data is itself
  a signal of limited difficulty in that split, not evidence of
  real-world robustness.
