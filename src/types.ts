export interface MCPRequest {
  command: string;
  args: Record<string, any>;
}

export interface MCPResponse {
  success: boolean;
  error?: string;
  result?: any;
} 
