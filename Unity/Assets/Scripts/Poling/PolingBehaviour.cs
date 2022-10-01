using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Collections;
using UnityEngine;
using UnityEngine.Networking;

public class PolingBehaviour : MonoBehaviour
{
    // Singleton
    private static PolingBehaviour instance;

    public static PolingBehaviour Instance
    {
        get
        {
            if (PolingBehaviour.instance == null)
            {
                GameObject gameObject = new GameObject(Guid.NewGuid().ToString());
                DontDestroyOnLoad(gameObject);
                PolingBehaviour.instance = gameObject.AddComponent<PolingBehaviour>();
            }
            return PolingBehaviour.instance;
        }
    }

    private const string POLING_URL = "https://vermorhp1e.execute-api.ap-northeast-1.amazonaws.com/production/poling/vote";
    public static float POLING_APAN_SECOND = 1.0f;

    public void StartPolingCorutine(Action<PolingResult> onPolingLoad)
    {
        StartCoroutine(LoopCorutine(POLING_APAN_SECOND, onPolingLoad));
    }

    private IEnumerator LoopCorutine(float second, Action<PolingResult> onPolingLoad)
    {
        // ループ
        while (true)
        {
            // secondで指定した秒数ループします
            yield return new WaitForSeconds(second);
            UnityWebRequest request = UnityWebRequest.Get(POLING_URL);
            yield return request.SendWebRequest();
            if (request.isHttpError || request.isNetworkError)
            {
                //4.エラー確認
                Debug.Log(request.error);
            }
            else
            {
                PolingResult result = JsonUtility.FromJson<PolingResult>(request.downloadHandler.text);
                onPolingLoad(result);
            }
        }
    }
}
