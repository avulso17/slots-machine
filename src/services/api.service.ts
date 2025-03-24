export class ApiService {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Define o token do usuário após autenticação
  setAuthToken(token: string) {
    this.authToken = token;
  }

  private async request(
    endpoint: string,
    method: string = "GET",
    data?: any
  ): Promise<any> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (this.authToken) {
      headers["Authorization"] = `Bearer ${this.authToken}`;
    }

    const options: RequestInit = {
      method,
      headers,
      credentials: "include",
    };

    if (data && (method === "POST" || method === "PUT")) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, options);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return await response.json();
  }

  // Métodos específicos para o jogo
  public async saveGameProgress(userId: string, progress: any): Promise<any> {
    return this.request("/game/progress", "POST", { userId, progress });
  }

  public async getGameProgress(userId: string): Promise<any> {
    return this.request(`/game/progress/${userId}`);
  }

  public async updateUserCoins(userId: string, coins: number): Promise<any> {
    return this.request("/user/coins", "PUT", { userId, coins });
  }
}
