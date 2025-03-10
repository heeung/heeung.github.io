---
title: "Android Compose Textfield 포커스를 처리해보자"
description: "Compose Textfield 구현에 필수적인 요소"
date: 2023-09-18
update: 2025-03-10
tags:
  - android
  - compose
# series: "compose"
---

> 상황 : 회원가입 페이지 구현 중 TextField에 관한 UX적인 부분의 구현이 필요했다.
> 

## 📌 구현 동작
<img src="https://velog.velcdn.com/images/heeung/post/f6be68e7-7827-4b4a-93f6-2457a76e6c3e/image.gif" width="250"/> | <img src="https://velog.velcdn.com/images/heeung/post/a61dece0-680e-4bf6-8f21-cd025a575176/image.gif" width="250"/>
---|---

<br />

## 📌 화면 터치로 TextField focus 빼기

- 처음에 할 것은 Modifier의 확장함수를 통해 전체화면의 터치 이벤트를 감지하여 clearFocus()하는 동작을 만들어 주는 것.

```kotlin
fun Modifier.addFocusCleaner(focusManager: FocusManager, doOnClear: () -> Unit = {}): Modifier {
    return this.pointerInput(Unit) {
        detectTapGestures(onTap = {
            doOnClear()
            focusManager.clearFocus()
        })
    }
}
```

- focusManager가 기능의 90프로를 차지하기 때문에 핵심이라고 생각했습니다.
- 사용할 곳에서는 →

```kotlin
val focusManager = LocalFocusManager.current
```

- 포커스 매니저를 불러옵니다.

```kotlin
@Composable
fun MainContent(

) {
		Scaffold(
		        modifier = Modifier
		            .fillMaxSize()
		            .addFocusCleaner(focusManager)
		) {

				...
		
		}
}
```

- 사용할 컴포저블 함수의 최상위 뷰에서 .addFocusCleaner를 Modifier에 추가해주면 그 아래 TextField들의 포커스 관리가 됩니다.

<br />

## 📌 안드로이드 키보드 Enter키 누르면 다음 TextField 포커싱 하기

- TextField를 `singleLine = true`로 만들면 키보드의 엔터키가 “완료”키로 바뀌어있는것을 확인할 수 있습니다.
- 완료키로 바뀌었기때문에 `KeyboardActions`의 `onDone`으로 구현이 가능하다.

```kotlin
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainTextField(
    text: String = "",
    onValueChange: (String) -> Unit,
    focusManager: FocusManager
) {
    OutlinedTextField(
        modifier = Modifier
            .fillMaxWidth(),
        label = { Text("입력") },
        value = text,
        onValueChange = onValueChange,
        singleLine = true,
        keyboardActions = KeyboardActions(onDone = {
            focusManager.moveFocus(FocusDirection.Next)
        })
    )
}
```

<br />

## 🔎 전체 코드

```kotlin
package test.composestarter

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.ExperimentalComposeUiApi
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusDirection
import androidx.compose.ui.focus.FocusManager
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.unit.dp
import test.composestarter.ui.theme.ComposeStarterTheme
import test.composestarter.ui.theme.WhiteColor

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ComposeStarterTheme {
                MainScreen()
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreen() {
    val focusManager = LocalFocusManager.current

    Scaffold(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp)
            .background(WhiteColor)
            .addFocusCleaner(focusManager),
    ) { paddingValues ->
        paddingValues
        var text1 by remember { mutableStateOf("") }
        var text2 by remember { mutableStateOf("") }
        var text3 by remember { mutableStateOf("") }

        Column(

        ) {
            MainTextField(
                text = text1,
                onValueChange = {
                    text1 = it
                },
                focusManager = focusManager
            )
            MainTextField(
                text = text2,
                onValueChange = {
                    text2 = it
                },
                focusManager = focusManager
            )
            MainTextField(
                text = text3,
                onValueChange = {
                    text3 = it
                },
                focusManager = focusManager
            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainTextField(
    text: String = "",
    onValueChange: (String) -> Unit,
    focusManager: FocusManager
) {
    OutlinedTextField(
        modifier = Modifier
            .fillMaxWidth(),
        label = { Text("입력") },
        value = text,
        onValueChange = onValueChange,
        singleLine = true,
        keyboardActions = KeyboardActions(onDone = {
            focusManager.moveFocus(FocusDirection.Next)
        })
    )
}

fun Modifier.addFocusCleaner(focusManager: FocusManager, doOnClear: () -> Unit = {}): Modifier {
    return this.pointerInput(Unit) {
        detectTapGestures(onTap = {
            doOnClear()
            focusManager.clearFocus()
        })
    }
}
```