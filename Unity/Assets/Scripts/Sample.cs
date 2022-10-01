using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Sample : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        PolingBehaviour.Instance.StartPolingCorutine((result) =>
        {
            Debug.Log(result.left.ToString());
        });
    }
}
