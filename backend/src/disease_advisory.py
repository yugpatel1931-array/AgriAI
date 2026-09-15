"""Conservative, disease-class advisory data for the web inference API.

The classifier predicts a PlantVillage-style class; it does not observe or
measure disease severity in the field.  The helpers here therefore describe
common signs to check and safe next actions rather than claiming that a
specific symptom was detected by the image model.
"""
from __future__ import annotations

from typing import Dict, List

from .assistant import FarmerAssistant


def _base(class_name: str, crop: str, disease: str) -> Dict[str, object]:
    healthy = disease.lower() == "healthy"
    if healthy:
        return {
            "explanation": (
                f"The image model classified this {crop} leaf as Healthy. "
                "This is an image-model result, not a laboratory diagnosis; "
                "continue routine field scouting."
            ),
            "symptoms": [
                "No disease class was selected by the model.",
                "Continue checking for new spots, discoloration, curling, or pest damage."
            ],
            "organicRecommendations": [
                "Continue regular field scouting and remove any newly damaged foliage.",
                "Maintain good field hygiene, balanced nutrition, and appropriate irrigation."
            ],
            "chemicalRecommendations": [
                "No disease treatment is indicated from this scan alone.",
                "Do not apply a pesticide solely because of this model result; treat only when a confirmed field problem warrants it."
            ],
            "prevention": [
                "Keep foliage and surrounding soil clean of diseased plant debris.",
                "Monitor neighbouring plants regularly for changes."
            ],
            "monitoring": [
                "Re-scan a clear close-up if new symptoms appear.",
                "Seek local expert confirmation if symptoms spread despite routine care."
            ],
            "whenToSeekHelp": "Get a local agriculture/KVK assessment if symptoms appear or spread.",
        }

    return {
        "explanation": (
            f"The image model classified this {crop} leaf as {disease}. "
            "The result is a screening prediction and should be confirmed against "
            "field symptoms before treatment decisions."
        ),
        "symptoms": [],
        "organicRecommendations": [],
        "chemicalRecommendations": [],
        "prevention": [],
        "monitoring": [],
        "whenToSeekHelp": "Seek local agriculture/KVK advice if symptoms are severe, spreading, or unclear.",
    }


def get_disease_advisory(class_name: str, crop: str, disease: str) -> Dict[str, object]:
    """Return conservative guidance based on the predicted disease category."""
    advisory = _base(class_name, crop, disease)
    key = f"{class_name} {disease}".lower()

    if "healthy" in key:
        return advisory

    if "late_blight" in key or "late blight" in key:
        advisory["symptoms"] = [
            "Irregular dark or water-soaked leaf lesions are common signs to check for.",
            "Rapid browning or collapse can occur when conditions remain cool, wet, or humid.",
            "Inspect nearby leaves and stems for newly developing lesions."
        ]
        advisory["organicRecommendations"] = [
            "Remove and safely dispose of severely affected foliage where practical; do not leave infected debris beside the crop.",
            "Avoid overhead irrigation and reduce prolonged leaf wetness.",
            "Improve airflow and monitor nearby plants closely."
        ]
        advisory["chemicalRecommendations"] = [
            "If treatment is confirmed as necessary, use only a locally registered product whose label includes the diagnosed crop/disease.",
            "Follow the product label for dose, application interval, protective equipment, and pre-harvest interval; confirm with a KVK/agriculture officer when unsure."
        ]
        advisory["prevention"] = [
            "Avoid prolonged foliage wetness and improve canopy airflow.",
            "Remove volunteer or visibly infected plant material from the production area."
        ]
        advisory["monitoring"] = [
            "Check the crop again after wet or humid weather, especially around previously affected plants.",
            "If lesions expand quickly, obtain local expert confirmation before further treatment."
        ]
        return advisory

    if "early_blight" in key or "early blight" in key:
        advisory["symptoms"] = [
            "Concentric dark lesions are a common sign to check for on older leaves.",
            "Yellowing around lesions and gradual lower-canopy decline can occur.",
            "Inspect leaves close to the soil line and neighbouring plants."
        ]
        advisory["organicRecommendations"] = [
            "Remove severely affected lower leaves and dispose of them away from healthy crop material.",
            "Use mulch or other measures that reduce soil splash onto foliage.",
            "Maintain good plant spacing and airflow."
        ]
        advisory["chemicalRecommendations"] = [
            "If field symptoms are confirmed, use only a locally registered fungicide labelled for the crop and disease.",
            "Follow the product label for dose, interval, PPE, and pre-harvest interval; consult a KVK/agriculture officer if uncertain."
        ]
        advisory["prevention"] = [
            "Avoid repeated leaf wetting from overhead irrigation.",
            "Keep diseased crop debris out of the production area."
        ]
        advisory["monitoring"] = [
            "Watch lower and inner-canopy leaves for new concentric lesions.",
            "Re-scan a clear close-up if symptoms change or spread."
        ]
        return advisory

    if "rust" in key:
        advisory["symptoms"] = [
            "Orange, yellow, or brown powdery pustules are common rust signs to check for.",
            "Progressive leaf yellowing or drying may accompany heavier infection."
        ]
        advisory["organicRecommendations"] = [
            "Remove heavily affected leaves where practical and keep the field free of infected debris.",
            "Avoid dense canopy conditions and maintain good airflow."
        ]
        advisory["chemicalRecommendations"] = [
            "If treatment is confirmed, use a locally registered rust-control product labelled for the crop.",
            "Follow the label exactly and obtain local extension advice when disease identity is uncertain."
        ]
        advisory["prevention"] = [
            "Scout regularly during weather conditions favourable to rust development.",
            "Avoid unnecessary dense planting and maintain field hygiene."
        ]
        advisory["monitoring"] = [
            "Inspect both sides of leaves and border rows for new pustules."
        ]
        return advisory

    if "mildew" in key or "mold" in key or "mould" in key:
        advisory["symptoms"] = [
            "White or grey fungal-looking growth is a common sign to check for on affected leaf surfaces.",
            "Yellowing, curling, or reduced leaf vigour may accompany infection."
        ]
        advisory["organicRecommendations"] = [
            "Improve spacing and airflow around foliage.",
            "Avoid unnecessary wetting of leaves and remove badly affected foliage."
        ]
        advisory["chemicalRecommendations"] = [
            "If treatment is confirmed, choose only a locally registered product labelled for the specific crop and disease.",
            "Follow label directions, PPE requirements, and pre-harvest interval."
        ]
        advisory["prevention"] = [
            "Avoid prolonged humid, stagnant canopy conditions.",
            "Monitor new growth closely after humid weather."
        ]
        advisory["monitoring"] = [
            "Check both older and newly emerging leaves for expanding patches."
        ]
        return advisory

    if "bacterial" in key:
        advisory["symptoms"] = [
            "Small water-soaked or dark necrotic spots can be associated with bacterial leaf diseases.",
            "Spots may enlarge or develop yellow margins under favourable conditions."
        ]
        advisory["organicRecommendations"] = [
            "Remove severely affected plant parts and disinfect cutting tools between plants.",
            "Avoid working the crop when foliage is wet and reduce leaf-to-leaf spread."
        ]
        advisory["chemicalRecommendations"] = [
            "Use only a locally registered product labelled for the confirmed bacterial disease and crop.",
            "Follow the label and local agricultural guidance rather than applying an unverified mixture."
        ]
        advisory["prevention"] = [
            "Use clean planting material and maintain field sanitation.",
            "Avoid unnecessary overhead irrigation."
        ]
        advisory["monitoring"] = [
            "Inspect neighbouring plants for new spots and rapid spread."
        ]
        return advisory

    if "mosaic" in key or "yellow_leaf_curl" in key or "virus" in key:
        advisory["symptoms"] = [
            "Mosaic or mottled colour patterns, leaf distortion, or curling are common signs to check for.",
            "Look for similar symptoms on neighbouring plants and signs of insect vectors."
        ]
        advisory["organicRecommendations"] = [
            "Remove and safely dispose of strongly symptomatic plants where practical to reduce spread.",
            "Control weeds and maintain field hygiene around the crop."
        ]
        advisory["chemicalRecommendations"] = [
            "Fungicides do not cure a viral infection. If insect vectors are present, use only locally registered control measures labelled for the crop and pest.",
            "Confirm the diagnosis with a local agriculture/KVK officer before major treatment decisions."
        ]
        advisory["prevention"] = [
            "Use healthy planting material and control known insect vectors through locally approved practices.",
            "Remove volunteer plants that can harbour infection."
        ]
        advisory["monitoring"] = [
            "Check nearby plants for similar patterns and curling."
        ]
        return advisory

    if "spot" in key:
        advisory["symptoms"] = [
            "Circular or irregular necrotic leaf spots are common signs to check for.",
            "Yellowing around spots or leaf drop can occur as infection progresses."
        ]
        advisory["organicRecommendations"] = [
            "Remove badly affected leaves and clear fallen infected debris.",
            "Avoid overhead irrigation and improve canopy airflow."
        ]
        advisory["chemicalRecommendations"] = [
            "If disease is confirmed, use only a locally registered product labelled for the crop and disease.",
            "Follow the product label and local extension guidance for safe use."
        ]
        advisory["prevention"] = [
            "Keep foliage dry where practical and avoid dense canopy conditions."
        ]
        advisory["monitoring"] = [
            "Track whether new spots appear on previously healthy leaves."
        ]
        return advisory

    if "rot" in key:
        advisory["symptoms"] = [
            "Dark, soft, water-soaked, or decaying tissue can be associated with rot diseases.",
            "Inspect stems, petioles, and nearby plant material for spread."
        ]
        advisory["organicRecommendations"] = [
            "Remove affected plant material and improve drainage around the root zone.",
            "Avoid excess irrigation and standing water."
        ]
        advisory["chemicalRecommendations"] = [
            "Treatment depends on the confirmed causal disease; use only a locally registered product labelled for the crop and diagnosis.",
            "Get local extension confirmation when the cause of rot is unclear."
        ]
        advisory["prevention"] = [
            "Maintain drainage and avoid prolonged waterlogging."
        ]
        advisory["monitoring"] = [
            "Inspect the root zone and nearby plants for new symptoms."
        ]
        return advisory

    if "spider_mites" in key or "spider mites" in key:
        advisory["symptoms"] = [
            "Fine stippling or bronzing on leaves and fine webbing are common signs to check for.",
            "Inspect leaf undersides closely for mites and their activity."
        ]
        advisory["organicRecommendations"] = [
            "Remove heavily infested leaves where practical and keep dust levels low around foliage.",
            "Preserve beneficial predatory insects where possible."
        ]
        advisory["chemicalRecommendations"] = [
            "If control is necessary, use only a locally registered miticide labelled for the crop and pest, following its label.",
            "Avoid repeated use of the same mode of action; seek local extension advice for resistance management."
        ]
        advisory["prevention"] = [
            "Scout leaf undersides regularly, especially during hot and dry conditions."
        ]
        advisory["monitoring"] = [
            "Recheck affected leaves and nearby plants for increasing stippling or webbing."
        ]
        return advisory

    # Generic fallback uses the project's existing grounded precaution rules.
    precaution = FarmerAssistant(language="en").explain_disease_result(class_name, 1.0)
    advisory["symptoms"] = [
        "Check the leaf for the visual signs normally associated with this disease class.",
        "Compare the result with neighbouring plants and field conditions before treatment."
    ]
    advisory["organicRecommendations"] = [
        "Remove severely affected material where practical and maintain good field sanitation.",
        "Avoid unnecessary leaf wetness and improve airflow."
    ]
    advisory["chemicalRecommendations"] = [
        "If the disease is confirmed, use only a locally registered product labelled for the crop and disease.",
        "Follow the label for dose, PPE, application interval, and pre-harvest interval."
    ]
    advisory["prevention"] = [
        "Continue routine scouting and good field hygiene."
    ]
    advisory["monitoring"] = [
        "Re-scan or seek local expert confirmation if symptoms spread or the image result is uncertain."
    ]
    return advisory
