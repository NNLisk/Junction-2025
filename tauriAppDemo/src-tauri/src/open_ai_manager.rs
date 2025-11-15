use async_openai::{
    types::{
        ChatCompletionRequestMessage, ChatCompletionRequestSystemMessageArgs,
        ChatCompletionRequestUserMessageArgs, CreateChatCompletionRequestArgs,
    },
    Client,
};
use serde::{Deserialize, Serialize};

// Response struct that matches what OpenAI returns
#[derive(Debug, Serialize, Deserialize)]
pub struct SoftwareAnalysis {
    pub name: String,
    pub clearance: bool,
    pub description: String,
    pub vendor_reputation: String,
    pub cve_history: String,
    pub incidents: String,
    pub datahandling_and_compliance: String,
    pub trust_score: i32,
    pub confidence_rating: i32,
    pub alternative: String,
}

impl SoftwareAnalysis {
    pub fn dummy(name: String) -> Self {
        SoftwareAnalysis {
            name: name.clone(),
            clearance: true,
            description: format!("This is a dummy analysis for {}", name),
            vendor_reputation: "No data available - dummy response".to_string(),
            cve_history: "No CVEs found - dummy response".to_string(),
            incidents: "No incidents reported - dummy response".to_string(),
            datahandling_and_compliance: "Unknown - dummy response".to_string(),
            trust_score: 50,
            confidence_rating: 0,
            alternative: "N/A - dummy response".to_string(),
        }
    }
}


pub struct OpenAIRequest {
    pub sw_name: String,
    pub sw_url: Option<String>,
    pub priority_sources: Vec<String>,
}

impl OpenAIRequest {
    pub fn new(sw_name: String) -> Self {
        OpenAIRequest {
            sw_name: sw_name,
            sw_url: None,
            priority_sources: vec![],
        }
    }

    pub fn with_url(mut self, url: String) -> Self {
        self.sw_url = Some(url);
        self
    }
}

pub fn fetch_software_info(request: &OpenAIRequest, api_key: &str) -> Result<SoftwareAnalysis, String> {

    Ok(SoftwareAnalysis::dummy(request.sw_name.clone()))
} 