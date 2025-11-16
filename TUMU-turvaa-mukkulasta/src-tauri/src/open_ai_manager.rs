use async_openai::{
    types::{
        ChatCompletionRequestMessage, ChatCompletionRequestSystemMessageArgs,
        ChatCompletionRequestUserMessageArgs, CreateChatCompletionRequestArgs,
    },
    Client,
    config::OpenAIConfig,
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
            priority_sources: vec![
                "PSRIT".to_string(),
                "Terms of service/data processing agreements".to_string(),
                "Systems and Organization Controls Type II (SOC 2)".to_string(),
                "ISO attestations".to_string(),
                "Reputable advisories/CERTS".to_string(),
                "CISA Known Exploited Vulnerabilities Catalog".to_string(),
            ],
        }
    }

    pub fn with_url(mut self, url: String) -> Self {
        self.sw_url = Some(url);
        self
    }


    fn build_prompt(&self) -> String {
            let url_context = if let Some(ref url) = self.sw_url {
                format!("\n- Software URL: {}", url)
            } else {
                String::new()
            };

            let sources_list = self
                .priority_sources
                .iter()
                .map(|s| format!("  - {}", s))
                .collect::<Vec<_>>()
                .join("\n");
            format!(
                r#"You are a software security assessor. Analyze the following software:

                Software Name: {}{}

                Priority Sources (prioritize these in your research):
                {}

                Provide your analysis as a SINGLE LINE with semicolon (;) delimiters in this EXACT order:
                vendor_reputation;cve_history;incidents;data_handling;trust_score;confidence_rating;clearance;alternatives

                Fields explanation:
                - vendor_reputation: Brief assessment of vendor security track record
                - cve_history: Summary of CVEs with severity and trends
                - incidents: Notable security incidents or breaches
                - data_handling: Data handling practices and compliance (GDPR, SOC2, etc)
                - trust_score: Integer 0-100 (overall trust score)
                - confidence_rating: Integer 0-100 (confidence in this assessment)
                - clearance: true or false (recommend usage: true=safe, false=not recommended)
                - alternatives: If clearance is false, suggest 1-2 alternatives; otherwise write "N/A"

                Example response:
                Established vendor with good security team;CVE-2021-44228 (critical) found in 2021, patches released quickly;Log4Shell incident December 2021 but handled well;GDPR compliant SOC2 Type II certified;75;85;true;N/A

                IMPORTANT: Reply with ONLY the semicolon-delimited line, no additional text."#,
                            self.sw_name, url_context, sources_list
            )
        }

    pub async fn execute(&self, api_key: &str) -> Result<SoftwareAnalysis, String> {
        // 1. Create OpenAI client
        let config = OpenAIConfig::new().with_api_key(api_key);
        let client = Client::with_config(config);

        // 2. Build messages
        let messages = vec![
            ChatCompletionRequestMessage::System(
                ChatCompletionRequestSystemMessageArgs::default()
                    .content("You are a cybersecurity analyst. Respond ONLY with the requested format.")
                    .build()
                    .map_err(|e| e.to_string())?
            ),
            ChatCompletionRequestMessage::User(
                ChatCompletionRequestUserMessageArgs::default()
                    .content(self.build_prompt())
                    .build()
                    .map_err(|e| e.to_string())?
            ),
        ];

        let request = CreateChatCompletionRequestArgs::default()
            .model("gpt-4o-mini")  // or "gpt-4o" for better quality
            .messages(messages)
            .temperature(0.3)  // Lower = more factual
            .max_tokens(500u32)
            .build()
            .map_err(|e| e.to_string())?;

        // 4. Call OpenAI API
        let response = client
            .chat()
            .create(request)
            .await
            .map_err(|e| format!("OpenAI API error: {}", e))?;

        let content = response
            .choices
            .first()
            .ok_or("No response from OpenAI")?
            .message
            .content
            .as_ref()
            .ok_or("Empty response content")?
            .trim();

        // 6. Parse semicolon-delimited response
        let parts: Vec<&str> = content.split(';').map(|s| s.trim()).collect();
        
        if parts.len() != 8 {
            return Err(format!(
                "Expected 8 fields but got {}. Response: {}", 
                parts.len(), 
                content
            ));
        }

        let trust_score = parts[4].parse::<i32>()
            .map_err(|_| format!("Invalid trust_score: {}", parts[4]))?;
        
        let confidence_rating = parts[5].parse::<i32>()
            .map_err(|_| format!("Invalid confidence_rating: {}", parts[5]))?;
        
        let clearance = parts[6].to_lowercase() == "true";

        Ok(SoftwareAnalysis {
            name: self.sw_name.clone(),
            vendor_reputation: parts[0].to_string(),
            cve_history: parts[1].to_string(),
            incidents: parts[2].to_string(),
            datahandling_and_compliance: parts[3].to_string(),
            trust_score,
            confidence_rating,
            clearance,
            description: format!("Security analysis for {}", self.sw_name),
            alternative: parts[7].to_string(),
        })
    }
}

pub async fn fetch_software_info(request: &OpenAIRequest, api_key: &str) -> Result<SoftwareAnalysis, String> {
    request.execute(api_key).await
} 